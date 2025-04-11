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
const getAllUser: RequestHandler = async (req, res, next) => {
  try {
    // console.log('req.user', req.user);
    const result = await UserServices.getAllUserFromDB();
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'get all user  successfully',
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updateUserRole: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const result = await UserServices.updateUserRoleFromDB(id, data);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'update user role  successfully',
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    await UserServices.deleteUserFromDB(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'delete user  successfully',
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    next(error);
  }
};
export const UserController = {
  createUser,
  getAllUser,
  updateUserRole,
  deleteUser,
};
