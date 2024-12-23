import config from '../../config';
import { User } from '../user/user.model';
import { TLoginUser } from './login.interface';
import jwt from 'jsonwebtoken';
const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExists(payload?.email);
  if (!user) {
    throw new Error('user is not found');
  }
  const isUserBlock = user.isBlocked;
  if (isUserBlock) {
    throw new Error('user is  block');
  }
  // const isPasswordMatch = user.password === payload.password;
  const isPasswordMatch = User.isPasswordMatch(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new Error('password is not match');
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
