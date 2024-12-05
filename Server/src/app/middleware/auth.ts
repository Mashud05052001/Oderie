import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import { jwtHelper } from "../utils/jwtHelper";
import { UserRole, UserStatus } from "@prisma/client";
import AppError from "../errors/AppError";
import { Prisma } from "../config";

/* AUTH Middleware */

const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = (req?.headers?.authorization as string)?.split(" ")[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Token is missing!");
    }
    const decoded = jwtHelper.verifyAccessToken(token) as JwtPayload;

    if (requiredRoles && !requiredRoles.includes(decoded?.role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    // DO user related work here
    const userData = await Prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!userData) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found!");
    } else if (userData.status === "BLOCKED" || userData.status === "DELETED") {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        `User has been ${userData.status}`
      );
    }

    if (decoded.role !== userData.role) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Authorization Failed due to invalid token"
      );
    }
    if (userData.role === "VENDOR") {
      const vendorProfile = await Prisma.vendor.findUnique({
        where: { email: userData.email },
      });
      if (vendorProfile?.isBlackListed) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "This vendor profile has been blacklisted"
        );
      }
    }

    req.user = decoded as JwtPayload;
    req.extendedUserData = {
      email: userData.email,
      password: userData.password,
      role: userData.role,
    };
    next();
  });
};

export default auth;
