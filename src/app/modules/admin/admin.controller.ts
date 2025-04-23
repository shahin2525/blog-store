import { RequestHandler } from 'express';
import { AdminServices } from './admin.service';
import { StatusCodes } from 'http-status-codes';

const blockUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.userId;
    // console.log(userData);
    await AdminServices.blockUserFromDB(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User deactivated successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};
//
const unBlockUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.userId;
    // console.log(userData);
    await AdminServices.unBlockUserFromDB(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User activated successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};
//
const deleteListingByAdmin: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(userData);
    await AdminServices.deleteListingByAdminFromDB(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Listing deleted successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};
const updateListingByAdmin: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    // console.log(userData);
    const result = await AdminServices.updateListingByAdminFromDB(id, data);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Listing update for admin successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  blockUser,
  deleteListingByAdmin,
  updateListingByAdmin,
  unBlockUser,
};
