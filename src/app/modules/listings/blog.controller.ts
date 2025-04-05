import { RequestHandler } from 'express';
import { ListingServices } from './blog.service';

import StatusCodes from 'http-status-codes';
const createListing: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const userData = req.user;
    // console.log(userData);
    const result = await ListingServices.createListingIntoDB(data, userData);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Listing created successfully',
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// blog update
const updateListing: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const userData = req.user;
    const id = req.params.id;
    // console.log(userData);
    const result = await ListingServices.updateListingIntoDB(
      id,
      data,
      userData,
    );
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Listing updated successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// delete user

const deleteListing: RequestHandler = async (req, res, next) => {
  try {
    const userData = req.user;
    const id = req.params.id;
    // console.log(userData);
    await ListingServices.deleteListingFromDB(id, userData);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Listing deleted successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};

const getAllListings: RequestHandler = async (req, res, next) => {
  try {
    const result = await ListingServices.getAllListingsFromDB(req.query);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'get all Listings fetched successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getAllListingsForAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await ListingServices.getAllListingForAdminFromDB();
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'get all Listings for admin fetched successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllListingByEmailForSingleLandlord: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    // const email = req.params.email;
    const userData = req.user;

    // console.log(email);
    const result =
      await ListingServices.getAllListingByEmailForSingleLandlordFromDB(
        userData,
      );
    res.status(200).json({
      status: true,
      message: 'get all listing for single landlord retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRentalListingRequestForSingleLandlord: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    // const email = req.params.email;
    const userData = req.user;

    // console.log(email);
    const result =
      await ListingServices.getAllRentalListingRequestForSingleLandlordFromDB(
        userData,
      );

    res.status(200).json({
      status: true,
      message:
        'get all rental request listing for single landlord retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ListingController = {
  createListing,
  updateListing,
  deleteListing,
  getAllListings,
  getAllListingByEmailForSingleLandlord,
  getAllListingsForAdmin,
  getAllRentalListingRequestForSingleLandlord,
};
