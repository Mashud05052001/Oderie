// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import { JwtPayload } from 'jsonwebtoken';
// import catchAsync from '../utils/catchAsync';
// import { jwtHelper } from '../utils/jwtToken';

// /* AUTH Middleware

// const auth = (userWithPassword: boolean, ...requiredRoles: TUserRoles[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = (req?.headers?.authorization as string)?.split(' ')[1];
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'Token is missing!');
//     }
//     const decoded = jwtHelper.verifyAccessToken(token) as JwtPayload;

//     if (requiredRoles && !requiredRoles.includes(decoded?.role)) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }

//     // DO user related work here
//     const user = await User.findUser(decoded?.email, userWithPassword);
//     if (!user) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');
//     }
//     if (decoded.role !== user.role) {
//       throw new AppError(
//         httpStatus.UNAUTHORIZED,
//         'Authorization Failed due to invalid token',
//       );
//     }

//     req.user = decoded as JwtPayload;
//     req.dbUser = user;
//     next();
//   });
// };

// export default auth;
