import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/appError';
import { TRequest } from './request.interface';
import { Listing } from '../listings/blog.model';
import { Request } from './request.modal';
import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';

const createTenantRequestIntoDB = async (
  userEmail: string,
  payload: TRequest,
) => {
  const user = await User.isUserExists(userEmail);

  const findListingData = await Listing.findById(payload.listingID);

  if (!findListingData) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Rental listing is not found.please select rental listing',
    );
  }
  payload.tenantID = user!._id;
  payload.listingID = findListingData._id;

  const result = await Request.create(payload);
  return result;
};
const deleteRequestFromDB = async (id: string) => {
  if (!(await Request.isRequestExists(id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'request id not found');
  }

  const result = await Request.findByIdAndDelete(id);
  return result;
};

const updateRequestFromDB = async (id: string, data: Partial<TRequest>) => {
  if (!(await Request.isRequestExists(id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'request id  not found');
  }
  const result = await Request.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return result;
};
const getAllRequestFromDB = async () => {
  const result = await Request.find();
  return result;
};

// payment verify
// const verifyPayment = async (request_id: string) => {
//   // console.log(request_id);
//   const verifiedPayment = await requestUtils.verifyPaymentAsync(request_id);

//   if (verifiedPayment.length) {
//     await Request.findOneAndUpdate(
//       {
//         'transaction.id': request_id,
//       },
//       {
//         'transaction.bank_status': verifiedPayment[0].bank_status,
//         'transaction.sp_code': verifiedPayment[0].sp_code,
//         'transaction.sp_message': verifiedPayment[0].sp_message,
//         'transaction.transactionStatus': verifiedPayment[0].transaction_status,
//         'transaction.method': verifiedPayment[0].method,
//         'transaction.date_time': verifiedPayment[0].date_time,
//         status:
//           verifiedPayment[0].bank_status == 'Success'
//             ? 'Paid'
//             : verifiedPayment[0].bank_status == 'Failed'
//               ? 'Pending'
//               : verifiedPayment[0].bank_status == 'Cancel'
//                 ? 'Cancelled'
//                 : '',
//       },
//     );
//   }

//   return verifiedPayment;
// };

const getSingleRequestFromDB = async (id: string) => {
  if (!(await Request.isRequestExists(id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'request id not found');
  }

  const result = await Request.findById(id);
  return result;
};
const getAllRequestByEmailForSingleCustomerFromDB = async (email: string) => {
  const result = await Request.find({ email });
  return result;
};
// const getAllTenantRequestForSingleTenantFromDB = async (data: JwtPayload) => {
//   const email = data?.data?.email;

//   // const user = await User.isUserExists(email);
//   // console.log(user?._id);
//   // const result = await Request.findById(user?._id);
//   // console.log('ser', result);

//   // return result;
//   // 1. Get landlord user
//   const user = await User.isUserExists(email);
//   console.log('user', user);
//   const tenantId = user?._id; //tenantId
//   console.log('tenantId', tenantId);
//   //find request owned by this tenant
//   // 2. Find listings owned by this landlord
//   const requests = await User.find({ tenantID: tenantId }, { _id: 1 });
//   console.log('requests', requests);
//   const requestIds = requests.map((listing) => listing._id);
//   console.log('requestIds', requestIds);
//   // 3. Find requests that match these listing IDs
//   const requestsForTenant = await Request.find({
//     tenantID: { $in: requestIds },
//   })
//     .populate('listingID') // optional: to include listing data
//     .populate('tenantID'); // optional: to include tenant data
//   console.log('res', requestsForTenant);
//   return requestsForTenant;
// };
const getAllTenantRequestForSingleTenantFromDB = async (data: JwtPayload) => {
  const email = data?.data?.email;

  // 1. Get tenant user
  const user = await User.isUserExists(email);
  if (!user) {
    throw new Error('User not found');
  }

  const tenantId = user._id;

  // 2. Find all requests where tenantID matches the user's ID
  const requestsForTenant = await Request.find({ tenantID: tenantId });
  // .populate('listingID') // optional: to include listing data
  // .populate('tenantID'); // optional: to include tenant data

  return requestsForTenant;
};
export const RequestServices = {
  createTenantRequestIntoDB,
  //   calculateRevenueFromDB,
  deleteRequestFromDB,
  updateRequestFromDB,
  getSingleRequestFromDB,
  getAllRequestFromDB,
  getAllRequestByEmailForSingleCustomerFromDB,
  getAllTenantRequestForSingleTenantFromDB,
  //   verifyPayment,
};
