import httpStatus from "http-status";
import config, { Prisma } from "../../config";
import AppError from "../../errors/AppError";
import { bcryptHelper } from "../../utils/bcryptPassword";
import {
  TChangePassword,
  TCheckResetCode,
  TForgetPassword,
  TLoginUser,
  TRegisterUser,
  TResetPassword,
  TSendContactEmail,
} from "./auth.interface";
import { User } from "@prisma/client";
import { jwtHelper } from "../../utils/jwtHelper";
import { TExtendedUserData, TJwtPayload } from "../../interface/jwt.type";
import {
  generatePasswordResetEmail,
  generateSendContactEmail,
} from "../../shared/generateEmail";
import { EmailHelper } from "../../utils/emailSender";
import moment from "moment";
import { generateRandomCode } from "../../shared/generateResetCode";

const registerUser = async (payload: TRegisterUser) => {
  const user = await Prisma.user.findUnique({
    where: { email: payload?.email },
  });
  if (user) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This email already have an account in our system. Try to login!"
    );
  }

  const hashedPassword = await bcryptHelper.createHashedPassword(
    payload.password
  );

  const result = await Prisma.$transaction(async (tsx) => {
    const registerUserData: Pick<User, "email" | "password" | "role"> = {
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    };
    const userOrVendorData = { name: payload.name, email: payload.email };

    const userData = await Prisma.user.create({
      data: registerUserData,
    });

    if (payload.role === "CUSTOMER") {
      await Prisma.profile.create({ data: userOrVendorData });
    } else if (payload.role === "VENDOR") {
      await Prisma.vendor.create({ data: userOrVendorData });
    }
    userData.password = "";
    return userData;
  });
  return result;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await Prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This email is not found. Please register first!"
    );
  }
  if (user.status === "BLOCKED") {
    throw new AppError(httpStatus.BAD_REQUEST, "This user has been blocked.");
  } else if (user.status === "DELETED") {
    throw new AppError(
      httpStatus.CONFLICT,
      "This user is deleted. Try to create a new one"
    );
  }

  const isPasswordMatched = bcryptHelper.compareHashedPasswordWithPlainText(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Incorrect Password");
  }

  const jwtPayload: TJwtPayload = {
    email: user?.email,
    role: user?.role,
  };
  const accessToken = jwtHelper.createJwtAccessToken(jwtPayload);
  const refreshToken = jwtHelper?.createJwtRefreshToken(jwtPayload);

  return { accessToken, refreshToken };
};

const changePassword = async (
  extendedUserData: TExtendedUserData,
  payload: TChangePassword
) => {
  if (payload?.newPassword === payload.oldPassword) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "New password cannot be same with old one"
    );
  }

  const isPasswordMatched = bcryptHelper.compareHashedPasswordWithPlainText(
    payload.oldPassword,
    extendedUserData.password
  );

  if (extendedUserData.role === "VENDOR") {
    const vendorData = await Prisma.vendor.findUnique({
      where: { email: extendedUserData.email },
    });
    if (vendorData?.isBlackListed) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "This vendor account is blacklisted."
      );
    }
  }

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Incorrect old password");
  }

  const hashedNewPassword = await bcryptHelper.createHashedPassword(
    payload?.newPassword
  );

  await Prisma.user.update({
    where: { email: extendedUserData.email },
    data: { password: hashedNewPassword },
  });

  return "Password changed successfully";
};

const accessToken = async (refreshToken: string) => {
  const decodedData = jwtHelper.verifyRefrestToken(refreshToken);

  const user = await Prisma.user.findUnique({
    where: { email: decodedData.email, status: "ACTIVE" },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }
  const jwtPayload: TJwtPayload = {
    email: user?.email,
    role: user?.role,
  };
  const accessToken = jwtHelper.createJwtAccessToken(jwtPayload);

  return accessToken;
};

const forgetPassword = async (payload: TForgetPassword) => {
  const user = await Prisma.user.findUnique({
    where: { email: payload.email, status: "ACTIVE" },
  });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This email is not registered yet. Please signup."
    );
  }

  const sixDigitCode = generateRandomCode(6);
  const upcomingTime = moment(new Date()).add(10, "minutes").toISOString();
  console.log(upcomingTime);
  const userData = await Prisma.user.update({
    where: { email: payload.email },
    data: {
      resetPasswordCode: sixDigitCode,
      resetPasswordExpiredDate: upcomingTime,
    },
    include: { Profile: true, Vendor: true },
  });
  const userProfile =
    userData?.role === "VENDOR" ? userData.Vendor : userData.Profile;

  const passwordResetHtml = generatePasswordResetEmail(
    userProfile?.name as string,
    sixDigitCode
  );

  await EmailHelper.sendEmail(
    user.email,
    passwordResetHtml,
    "high",
    config.sender_email
  );
  return "Password reset request send successfully";
};

const checkResetCode = async (payload: TCheckResetCode) => {
  const user = await Prisma.user.findUnique({
    where: { email: payload.email, status: "ACTIVE" },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This email is not found.");
  }

  if (!user.resetPasswordCode || !user.resetPasswordExpiredDate) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Invalid request. Please try again."
    );
  }

  if (user.resetPasswordCode !== payload.code) {
    throw new AppError(httpStatus.FORBIDDEN, "The code is incorrect.");
  }

  if (new Date() > user.resetPasswordExpiredDate) {
    await Prisma.user.update({
      where: { email: payload.email },
      data: { resetPasswordCode: null, resetPasswordExpiredDate: null },
    });
    throw new AppError(httpStatus.FORBIDDEN, "The code has been expired.");
  }

  return "Reset code is valid";
};

const resetPassword = async (payload: TResetPassword) => {
  const user = await Prisma.user.findUnique({
    where: { email: payload.email, status: "ACTIVE" },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This email is not found.");
  }
  if (!user?.resetPasswordCode || !user?.resetPasswordExpiredDate) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Invalid request. Please try again"
    );
  }

  if (user.resetPasswordCode !== payload.code) {
    throw new AppError(httpStatus.FORBIDDEN, "The code is incorrect.");
  }

  if (new Date() > user.resetPasswordExpiredDate) {
    await Prisma.user.update({
      where: { email: payload.email },
      data: { resetPasswordCode: null, resetPasswordExpiredDate: null },
    });
    throw new AppError(httpStatus.FORBIDDEN, "The code has been expired.");
  }

  const hashedNewPassword = await bcryptHelper.createHashedPassword(
    payload.password
  );

  await Prisma.user.update({
    where: { email: payload.email },
    data: {
      password: hashedNewPassword,
      resetPasswordCode: null,
      resetPasswordExpiredDate: null,
    },
  });

  return "Password reset successful. Please login to continue";
};

const sendContactEmail = async (payload: TSendContactEmail) => {
  const { message, sendToEmail, userEmail, userName } = payload;
  const html = generateSendContactEmail(userName, userEmail, message);
  await EmailHelper.sendEmail(
    sendToEmail,
    html,
    "normal",
    userEmail,
    "Oderie Contact Us"
  );
  return "Email send successfull";
};

export const AuthService = {
  registerUser,
  loginUser,
  changePassword,
  accessToken,
  forgetPassword,
  checkResetCode,
  resetPassword,
  sendContactEmail,
};
