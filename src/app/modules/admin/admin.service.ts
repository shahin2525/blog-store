import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { Listing } from '../listings/blog.model';
import { TListing } from '../listings/blog.interface';

const blockUserFromDB = async (id: string) => {
  const user = await User.doesUserExists(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user does not found');
  }
  const userStatusBlocked = user.deactivate;
  if (userStatusBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'user is already deactivated ');
  }
  const result = await User.findByIdAndUpdate(
    id,
    { deactivate: true },
    { new: true, runValidators: true },
  );
  return result;
};
const unBlockUserFromDB = async (id: string) => {
  const user = await User.doesUserExists(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user does not found');
  }
  const userStatusNotBlocked = !user.deactivate;
  if (userStatusNotBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'user is already activated ');
  }
  const result = await User.findByIdAndUpdate(
    id,
    { deactivate: false },
    { new: true, runValidators: true },
  );
  return result;
};

//
const deleteListingByAdminFromDB = async (id: string) => {
  const listing = await Listing.isListingExists(id);
  if (!listing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'listing does not found');
  }
  //   const userStatusBlocked = user.isBlocked;
  //   if (userStatusBlocked) {
  //     throw new AppError(StatusCodes.BAD_REQUEST, 'user is already blocked ');
  //   }
  const result = await Listing.findByIdAndDelete(id);
  return result;
};
const updateListingByAdminFromDB = async (
  id: string,
  data: Partial<TListing>,
) => {
  if (!(await Listing.isListingExists(id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'listing id  not found');
  }
  const result = await Listing.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const AdminServices = {
  blockUserFromDB,
  deleteListingByAdminFromDB,
  updateListingByAdminFromDB,
  unBlockUserFromDB,
};
