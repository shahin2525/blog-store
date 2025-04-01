import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { Listing } from '../listings/blog.model';

const blockUserFromDB = async (id: string) => {
  const user = await User.doesUserExists(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user does not found');
  }
  const userStatusBlocked = user.isBlocked;
  if (userStatusBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'user is already blocked ');
  }
  const result = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true, runValidators: true },
  );
  return result;
};

const deleteListingFromDB = async (id: string) => {
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
export const AdminServices = {
  blockUserFromDB,
  deleteListingFromDB,
};
