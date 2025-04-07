import { RequestHandler } from 'express';

import StatusCodes from 'http-status-codes';
import { LoginServices } from './login.service';
import { LoginValidations } from './login.validation';
import config from '../../config';

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const validatedData =
      LoginValidations.loginUserValidationSchema.parse(data);
    const result = await LoginServices.loginUser(validatedData);

    // console.log('result', result);
    // console.log('cookie', req.cookies);

    const { accessToken, refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      // sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'login successful',
      statusCode: StatusCodes.OK,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const { ...passwordData } = req.body;
    const validatedData =
      LoginValidations.changePasswordValidationSchema.parse(passwordData);

    const result = await LoginServices.changePassword(req.user, validatedData);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password is updated successfully!',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const validateRefreshToken =
      LoginValidations.refreshTokenValidationSchema.parse({
        cookies: req.cookies,
      });

    const { refreshToken } = validateRefreshToken.cookies;

    const result = await LoginServices.refreshToken(refreshToken);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Access token is retrieved successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const userData = req.user;
    const { name, email, oldPassword, newPassword } = req.body; // Allowed fields

    // Ensure only valid fields are updated
    // const updatedUser = await updateUserProfile(userId, { name, email, oldPassword, newPassword });

    const result = await LoginServices.updateUserProfile(userData, {
      name,
      email,
      oldPassword,
      newPassword,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'update profile successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const LoginController = {
  loginUser,
  changePassword,
  refreshToken,
  updateUserProfile,
};
