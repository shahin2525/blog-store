import { JwtPayload } from 'jsonwebtoken';
import { TListing } from './blog.interface';
import { Listing } from './blog.model';
import { User } from '../user/user.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/appError';
import mongoose from 'mongoose';

const createListingIntoDB = async (payload: TListing, userData: JwtPayload) => {
  const { data } = userData;
  const { email } = data;
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user is not found');
  }
  const isBlocked = user.deactivate;
  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'you  are deactivated');
  }

  payload.landlordID = user?._id;
  const result = await Listing.create(payload);

  return result;
};
const getAllListingsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  const { search, sortBy, ...otherFilters } = query;

  // Search logic (partial match for title or content)
  if (search) {
    const searchRegex = { $regex: search as string, $options: 'i' };
    filter.$or = [{ location: searchRegex }, { content: searchRegex }];
  }

  // Exact match filters
  Object.keys(otherFilters).forEach((key) => {
    if (key === 'author') {
      // Convert to ObjectId for author filtering
      filter[key] = new mongoose.Types.ObjectId(otherFilters[key] as string);
    } else {
      filter[key] = { $regex: otherFilters[key], $options: 'i' };
    }
  });

  // Default sort by newest blogs first

  const sort = sortBy ? (sortBy as string) : '-createdAt';

  const result = await Listing.find(filter).sort(sort);

  return result;
};
const updateListingIntoDB = async (
  id: string,
  payload: Partial<TListing>,
  userData: JwtPayload,
) => {
  const { data } = userData;
  const { email } = data;
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user is not found');
  }
  const isBlocked = user.deactivate;
  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'you are deactivated');
  }

  const blogInfo = await Listing.findById(id);

  const isListingAuthorMatch =
    blogInfo?.landlordID.toString() !== user._id.toString();

  if (isListingAuthorMatch) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'landlord does not exists this listing',
    );
  }

  const result = await Listing.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deleteListingFromDB = async (
  id: string,

  userData: JwtPayload,
) => {
  const { data } = userData;
  const { email } = data;
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user is not found');
  }
  const isBlocked = user.deactivate;
  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'you are deactivated');
  }

  const blogInfo = await Listing.findById(id);

  const isListingAuthorMatch =
    blogInfo?.landlordID.toString() !== user._id.toString();

  if (isListingAuthorMatch) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'landlord does not exists this listing',
    );
  }

  const result = await Listing.findByIdAndDelete(id);

  return result;
};

const getAllListingByEmailForSingleLandlordFromDB = async (
  payload: JwtPayload,
) => {
  const { data } = payload;
  const email = data?.email;
  const result = await Listing.find({ email });
  return result;
};

export const ListingServices = {
  createListingIntoDB,
  updateListingIntoDB,
  deleteListingFromDB,
  getAllListingsFromDB,
  getAllListingByEmailForSingleLandlordFromDB,
};

/*
const getAllListingsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  // Extract search and filter fields
  const { search, ...otherFilters } = query;

  // Apply search on title or content
  if (search) {
    const searchRegex = { $regex: search as string, $options: 'i' };
    filter.$or = [
      { title: searchRegex },
      { content: searchRegex }
    ];
  }

  // Apply exact match filters (like title, author)
  Object.keys(otherFilters).forEach((key) => {
    if (key === 'author') {
      // Convert author to ObjectId
      filter[key] = new mongoose.Types.ObjectId(otherFilters[key] as string);
    } else {
      // Direct filter for other fields
      filter[key] = otherFilters[key];
    }
  });

  console.log('Final Filter:', filter); // Debugging

  // Fetch data with dynamic filter
  const result = await Listing.find(filter).sort('-createdAt');

  return result;
};
*/
