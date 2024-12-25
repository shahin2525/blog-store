import { RequestHandler } from 'express';
import { UserServices } from './user.service';

import StatusCodes from 'http-status-codes';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;

    const result = await UserServices.createUserIntoDB(data);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User registered successfully',
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const UserController = {
  createUser,
};
