import { JwtPayload } from 'jsonwebtoken';
import { TListing } from './blog.interface';
import { Listing } from './blog.model';
import { User } from '../user/user.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/appError';

import { Request } from '../request/request.modal';
import { TRequest } from '../request/request.interface';

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
// const getAllListingsFromDB = async (query: Record<string, unknown>) => {
//   const filter: Record<string, unknown> = {};
//   const { search, sortBy, ...otherFilters } = query;

//   // Search logic (partial match for title or content)
//   if (search) {
//     const searchRegex = { $regex: search as string, $options: 'i' };
//     filter.$or = [{ location: searchRegex }, { content: searchRegex }];
//   }

//   // Exact match filters
//   Object.keys(otherFilters).forEach((key) => {
//     if (key === 'author') {
//       // Convert to ObjectId for author filtering
//       filter[key] = new mongoose.Types.ObjectId(otherFilters[key] as string);
//     } else {
//       filter[key] = { $regex: otherFilters[key], $options: 'i' };
//     }
//   });

//   // Default sort by newest blogs first

//   const sort = sortBy ? (sortBy as string) : '-createdAt';

//   const result = await Listing.find(filter).sort(sort);

//   return result;
// };
// const getAllListingsFromDB = async (query: Record<string, unknown>) => {
//   const filter: Record<string, unknown> = {};
//   const { search, rentAmount, numberOfBedrooms, ...otherFilters } = query;

//   // Search by location (partial match)
//   if (search) {
//     filter.location = { $regex: search as string, $options: 'i' };
//   }

//   // Filter by rent amount range
//   if (rentAmount) {
//     const [min, max] = rentAmount.toString().split('-');
//     if (max === '+') {
//       filter.rentAmount = { $gte: Number(min) };
//     } else {
//       filter.rentAmount = { $gte: Number(min), $lte: Number(max) };
//     }
//   }

//   // Filter by number of bedrooms range
//   if (numberOfBedrooms) {
//     const [min, max] = numberOfBedrooms.toString().split('-');
//     if (max === '+') {
//       filter.numberOfBedrooms = { $gte: Number(min) };
//     } else {
//       filter.numberOfBedrooms = { $gte: Number(min), $lte: Number(max) };
//     }
//   }

//   // Other exact match filters
//   Object.keys(otherFilters).forEach((key) => {
//     if (otherFilters[key]) {
//       filter[key] = otherFilters[key];
//     }
//   });

//   // Query the database with the constructed filter
//   return await Listing.find(filter).exec();
// };

const getAllListingsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  const { search, rentAmount, numberOfBedrooms, ...otherFilters } = query;

  // Search by location (partial match)
  if (search) {
    filter.location = { $regex: search as string, $options: 'i' };
  }

  // Filter by rent amount (exact match or range)
  if (rentAmount) {
    if (typeof rentAmount === 'string' && rentAmount.includes('-')) {
      // Handle range query (e.g., "500-1000" or "1000-+")
      const [min, max] = rentAmount.split('-');
      if (max === '+') {
        filter.rentAmount = { $gte: Number(min) };
      } else {
        filter.rentAmount = { $gte: Number(min), $lte: Number(max) };
      }
    } else {
      // Handle exact amount query (e.g., "750")
      filter.rentAmount = Number(rentAmount);
    }
  }

  // Filter by number of bedrooms (exact match or range)
  if (numberOfBedrooms) {
    if (
      typeof numberOfBedrooms === 'string' &&
      numberOfBedrooms.includes('-')
    ) {
      // Handle range query (e.g., "2-3" or "4-+")
      const [min, max] = numberOfBedrooms.split('-');
      if (max === '+') {
        filter.numberOfBedrooms = { $gte: Number(min) };
      } else {
        filter.numberOfBedrooms = { $gte: Number(min), $lte: Number(max) };
      }
    } else {
      // Handle exact number query (e.g., "2")
      filter.numberOfBedrooms = Number(numberOfBedrooms);
    }
  }

  // Other exact match filters
  Object.keys(otherFilters).forEach((key) => {
    if (otherFilters[key]) {
      filter[key] = otherFilters[key];
    }
  });

  // Query the database with the constructed filter
  return await Listing.find(filter).exec();
};
const getAllListingForAdminFromDB = async () => {
  const result = await Listing.find();
  return result;
};
const getAllListingForSingleLandlordFromDB = async (userData: JwtPayload) => {
  const user = await User.findById(userData?.data?.userId);

  if (!user) {
    throw new Error('user not found');
  }

  const isBlocked = user.deactivate;
  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'you are deactivated');
  }
  const result = await Listing.find({ landlordID: userData?.data?.userId });
  return result;
};
const getAllRentalListingRequestForSingleLandlordFromDB = async (
  data: JwtPayload,
) => {
  const email = data?.data?.email;

  // const user = await User.isUserExists(email);
  // console.log(user?._id);
  // const result = await Request.findById(user?._id);
  // console.log('ser', result);

  // return result;
  // 1. Get landlord user
  const user = await User.isUserExists(email);
  const landlordId = user?._id;

  // 2. Find listings owned by this landlord
  const listings = await Listing.find({ landlordID: landlordId }, { _id: 1 });

  const listingIds = listings.map((listing) => listing._id);

  // 3. Find requests that match these listing IDs
  const requests = await Request.find({
    listingID: { $in: listingIds },
  })
    .populate('listingID') // optional: to include listing data
    .populate('tenantID'); // optional: to include tenant data

  return requests;
};
const getSingleListingIntoDB = async (id: string) => {
  // const { data } = userData;
  // const { email } = data;
  // const user = await User.isUserExists(email);
  // if (!user) {
  //   throw new AppError(StatusCodes.NOT_FOUND, 'user is not found');
  // }
  // const isBlocked = user.deactivate;
  // if (isBlocked) {
  //   throw new AppError(StatusCodes.FORBIDDEN, 'you are deactivated');
  // }

  const result = await Listing.findById(id);

  // const isListingLandlordMatch =
  //   listingInfo?.landlordID.toString() !== user._id.toString();

  // if (isListingLandlordMatch) {
  //   throw new AppError(
  //     StatusCodes.BAD_REQUEST,
  //     'landlord does not exists this listing',
  //   );
  // }

  // const result = await Listing.findByIdAndUpdate(id, payload, {
  //   new: true,
  // });

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

  const listingInfo = await Listing.findById(id);

  const isListingLandlordMatch =
    listingInfo?.landlordID.toString() !== user._id.toString();

  if (isListingLandlordMatch) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'landlord does not exists this listing',
    );
  }

  const result = await Listing.findByIdAndDelete(id);

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

  const listingInfo = await Listing.findById(id);

  const isListingLandlordMatch =
    listingInfo?.landlordID.toString() !== user._id.toString();

  if (isListingLandlordMatch) {
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

const getAllListingByEmailForSingleLandlordFromDB = async (
  payload: JwtPayload,
) => {
  const { data } = payload;
  const email = data?.email;
  const result = await Listing.find({ email });
  return result;
};

const respondRentalRequestIntoDB = async (
  id: string,
  payload: Partial<TRequest>,
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

  const requestInfo = await Request.findById(id);
  if (!requestInfo) {
    throw new Error('request not found');
  }
  const requestInfoListingId = requestInfo?.listingID;
  const requestInfoLandlordId = await Listing.findById(requestInfoListingId);

  const isRequestAndLandlordNotMatch =
    requestInfoLandlordId?.landlordID.toString() !== user._id.toString();

  if (isRequestAndLandlordNotMatch) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'landlord does not exists this request',
    );
  }

  const result = await Request.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};
export const ListingServices = {
  createListingIntoDB,
  updateListingIntoDB,
  deleteListingFromDB,
  getAllListingsFromDB,
  getAllListingByEmailForSingleLandlordFromDB,
  getAllListingForAdminFromDB,
  getAllRentalListingRequestForSingleLandlordFromDB,
  respondRentalRequestIntoDB,
  getAllListingForSingleLandlordFromDB,
  getSingleListingIntoDB,
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
