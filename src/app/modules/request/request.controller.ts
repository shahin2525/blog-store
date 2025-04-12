import { RequestHandler } from 'express';
// import { RequestServices } from './request.service';
import { StatusCodes } from 'http-status-codes';
import { RequestServices } from './request.service';

const createTenantRequest: RequestHandler = async (req, res, next) => {
  try {
    const userEmail = req.user?.data.email;
    // console.log('user', userEmail);
    // const user
    const payload = req.body;
    const result = await RequestServices.createTenantRequestIntoDB(
      userEmail,
      payload,
      //   req.ip!,
    );

    res.status(200).json({
      message: 'Rental Request created successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// verify payment

// const verifyPayment = catchAsync(async (req, res) => {
//   const request = await requestService.verifyPayment(req.query.request_id as string);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     message: "Request verified successfully",
//     data: request,
//   });
// });

// const verifyPayment: RequestHandler = async (req, res, next) => {
//   try {
//     const result = await RequestServices.verifyPayment(
//       req.query.request_id as string,
//     );
//     // console.log(result);
//     res.status(200).json({
//       status: true,
//       message: 'Request verified successfully',
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// calculate total revenue
// const calculateTotalRevenue: RequestHandler = async (req, res, next) => {
//   try {
//     const result = await RequestServices.calculateRevenueFromDB();

//     res.status(200).json({
//       message: 'Revenue calculated successfully',
//       status: true,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const deleteRequest: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.requestId;
    // console.log(userData);
    await RequestServices.deleteRequestFromDB(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Request deleted successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};
const updateRequest: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.requestId;
    const data = req.body;
    const result = await RequestServices.updateRequestFromDB(id, data);
    res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getAllRequest: RequestHandler = async (req, res, next) => {
  try {
    const result = await RequestServices.getAllRequestFromDB();
    res.status(200).json({
      success: true,
      message: 'Requests retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// get single request
const getSingleRequest: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.requestId;
    const result = await RequestServices.getSingleRequestFromDB(id);
    res.status(200).json({
      success: true,
      message: 'single request retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// get all request for single user
const getAllRequestByEmailForSingleTenant: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const email = req.params.email;
    // console.log(email);
    const result =
      await RequestServices.getAllRequestByEmailForSingleCustomerFromDB(email);
    res.status(200).json({
      success: true,
      message: 'get all requests for single tenant retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTenantRequestForSingleTenant: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    // const email = req.params.email;
    const userData = req.user;

    // console.log(email);
    const result =
      await RequestServices.getAllTenantRequestForSingleTenantFromDB(userData);

    res.status(200).json({
      success: true,
      message:
        'get all tenant requests for single tenant retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const RequestControllers = {
  deleteRequest,
  createTenantRequest,
  //   calculateTotalRevenue,
  updateRequest,
  getAllRequest,
  getSingleRequest,
  getAllRequestByEmailForSingleTenant,
  getAllTenantRequestForSingleTenant,
  //   verifyPayment,
};
