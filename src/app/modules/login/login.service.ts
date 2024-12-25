import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { TLoginUser } from './login.interface';
import jwt from 'jsonwebtoken';
const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExists(payload?.email);
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials 1');
  }
  const isUserBlock = user.isBlocked;
  if (isUserBlock) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials 2');
  }

  const isPasswordMatch = await User.isPasswordMatch(
    payload.password,
    user.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid password');
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

// mir
/*
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoibWlyQG0uY29tIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNzM1MTA2ODkzLCJleHAiOjE3MzUxOTMyOTN9.heSboNz-IEa3po97I43jcQzjiJgScplQ51NtijfLViU
*/
// rakib
/*
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoicmFraWJAci5jb20iLCJyb2xlIjoidXNlciJ9LCJpYXQiOjE3MzUxMDYzODQsImV4cCI6MTczNTE5Mjc4NH0.GaFzcJGMkTDQ5nFMRwSCfpT7mz0QoDUOVK9u7D0VTbY

Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoicmFraWJAci5jb20iLCJyb2xlIjoidXNlciJ9LCJpYXQiOjE3MzUxMDYzODQsImV4cCI6MTczNTE5Mjc4NH0.GaFzcJGMkTDQ5nFMRwSCfpT7mz0QoDUOVK9u7D0VTbY
*/
