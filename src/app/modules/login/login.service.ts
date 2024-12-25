import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { TLoginUser } from './login.interface';
import jwt from 'jsonwebtoken';
const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExists(payload?.email);
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'user is not found');
  }
  const isUserBlock = user.isBlocked;
  if (isUserBlock) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'user is  block');
  }
  // const isPasswordMatch = user.password === payload.password;
  console.log(payload.password, 'and ', user.password);
  const isPasswordMatch = await User.isPasswordMatch(
    payload.password,
    user.password,
  );
  console.log(isPasswordMatch);
  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'password is not match');
  }
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };
  const accessToken = jwt.sign(
    {
      data: jwtPayload,
    },
    config.jwt_secret as string,
    { expiresIn: '1d' },
  );
  return {
    token: `Bearer ${accessToken}`,
  };
};
export const LoginServices = {
  loginUser,
};
