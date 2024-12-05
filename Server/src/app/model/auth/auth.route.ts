import { Router } from "express";
import validateRequest, {
  validateRequestCookies,
} from "../../middleware/validateRequest";
import { AuthController } from "./auth.s.controller";
import { AuthValidation } from "./auth.validation";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordValidationSchema),
  auth("ADMIN", "CUSTOMER", "VENDOR"),
  AuthController.changePassword
);

router.post(
  "/refresh-token",
  validateRequestCookies(AuthValidation.accessTokenValidationSchema),
  AuthController.accessToken
);

router.post(
  "/forget-password",
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthController.forgetPassword
);

router.post(
  "/check-reset-code",
  validateRequest(AuthValidation.checkResetCodeValidationSchema),
  AuthController.checkResetCode
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

router.post(
  "/send-contact-email",
  validateRequest(AuthValidation.sendEmailValidationSchem),
  AuthController.sendContactEmail
);

export const AuthRoutes = router;
