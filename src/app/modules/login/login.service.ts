import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { TLoginUser } from './login.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { hashSync } from 'bcryptjs';
import bcrypt from 'bcryptjs';
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
    // todo first
    // token: `Bearer ${accessToken}`,
    token: accessToken,
  };
};
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  // todo check userData
  /*
 const user = await User.isUserExistsByCustomId(userData.userId);

 const user = await User.isUserExistsByCustomId(payload.id);

*/

  const user = await User.isUserExists(userData?.email);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  // const isDeleted = user?.isDeleted;

  // if (isDeleted) {
  //   throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  // }
  const isUserBlock = user.isBlocked;
  if (isUserBlock) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials 2');
  }

  // checking if the user is blocked

  // const userStatus = user?.status;

  // if (userStatus === 'blocked') {
  //   throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  // }

  //checking if the password is correct

  // if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
  //   throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //new

  const isPasswordMatch = await User.isPasswordMatch(
    payload.oldPassword,
    user.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid password');
  }

  //hash new password
  const newHashedPassword = hashSync(
    payload.newPassword,
    Number(config.bcrypt_salt),
  );
  //todo
  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      // needsPasswordChange: false,
      // passwordChangedAt: new Date(),
      new: true,
    },
  );

  return null;
};
export const LoginServices = {
  loginUser,
  changePassword,
};
