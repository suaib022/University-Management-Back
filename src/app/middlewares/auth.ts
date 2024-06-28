import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../Modules/User/user.constant';
import { User } from '../Modules/User/userModel';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // check the existence of token
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // verify token
    // jwt.verify(
    //   token,
    //   config.jwt_access_token_secret as string,
    //   function (err, decoded) {

    //     const role = (decoded as JwtPayload).role;
    //     if (requiredRoles && !requiredRoles.includes(role)) {
    //       throw new AppError(httpStatus.UNAUTHORIZED, 'you are not admin!');
    //     }
    //     req.user = decoded as JwtPayload;
    //     next();
    //   },
    // );

    const decoded = jwt.verify(
      token,
      config.jwt_access_token_secret as string,
    ) as JwtPayload;

    const { role, userId, iat, exp } = decoded;

    const user = await User.doesUserExistsByCustomId(userId);

    // checking if the user is exist
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    // checking if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'you are not admin!');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
