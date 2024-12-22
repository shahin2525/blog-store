import { RequestHandler } from 'express';

import StatusCodes from 'http-status-codes';
import { LoginServices } from './login.service';
import { LoginValidations } from './login.validation';
const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const validatedData =
      LoginValidations.loginUserValidationSchema.parse(data);
    const result = await LoginServices.loginUser(validatedData);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'login successful',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const LoginController = {
  loginUser,
};
