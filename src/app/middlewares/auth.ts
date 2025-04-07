import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../modules/user/user.interface';
import AppError from '../error/appError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import { User } from '../modules/user/user.model';
//...requiredRoles: TUserRole[]
const auth = (...requiredRoles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.headers.authorization);
      const token = req.headers.authorization?.split(' ')[1];
      // console.log(token);
      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, 'you are unauthorize 1');
      }
      const decoded = jwt.verify(token, config.jwt_secret as string);
      //   console.log(decoded);
      const { data } = decoded as JwtPayload;
      const { email, role } = data;
      const user = await User.isUserExists(email);
      if (!user) {
        throw new AppError(StatusCodes.FORBIDDEN, 'you are unauthorize 2');
      }
      const isBlocked = user.deactivate;
      if (isBlocked) {
        throw new AppError(StatusCodes.FORBIDDEN, 'you are unauthorize 3');
      }
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(StatusCodes.FORBIDDEN, 'you are unauthorize 4');
      }
      req.user = decoded as JwtPayload;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
