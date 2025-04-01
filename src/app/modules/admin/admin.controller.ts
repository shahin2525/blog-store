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
      message: 'User blocked successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};

const deleteListing: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(userData);
    await AdminServices.deleteListingFromDB(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Listing deleted successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  blockUser,
  deleteListing,
};
