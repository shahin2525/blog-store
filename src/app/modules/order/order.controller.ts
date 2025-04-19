import { RequestHandler } from 'express';
import { OrderServices } from './order.service';
import { StatusCodes } from 'http-status-codes';

const createOrderBike: RequestHandler = async (req, res, next) => {
  try {
    const userEmail = req.user?.data.email;
    // console.log('user', userEmail);
    // const user
    const payload = req.body;
    const result = await OrderServices.createOrderListingIntoDB(
      userEmail,
      payload,
      req.ip!,
    );

    res.status(200).json({
      message: 'Order  created successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// verify payment

// const verifyPayment = catchAsync(async (req, res) => {
//   const order = await orderService.verifyPayment(req.query.order_id as string);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     message: "Order verified successfully",
//     data: order,
//   });
// });

const verifyPayment: RequestHandler = async (req, res, next) => {
  try {
    const result = await OrderServices.verifyPayment(
      req.query.order_id as string,
    );
    // console.log(result);
    res.status(200).json({
      status: true,
      message: 'Order verified successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// calculate total revenue
const calculateTotalRevenue: RequestHandler = async (req, res, next) => {
  try {
    const result = await OrderServices.calculateRevenueFromDB();

    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.orderId;
    // console.log(userData);
    await OrderServices.deleteOrderFromDB(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Order deleted successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};
const updateOrder: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.orderId;
    const data = req.body;
    const result = await OrderServices.updateOrderFromDB(id, data);
    res.status(200).json({
      status: true,
      message: 'Order updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getAllOrder: RequestHandler = async (req, res, next) => {
  try {
    const result = await OrderServices.getAllOrderFromDB();
    res.status(200).json({
      status: true,
      message: 'Orders retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// get single order
const getSingleOrder: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.orderId;
    const result = await OrderServices.getSingleOrderFromDB(id);
    res.status(200).json({
      status: true,
      message: 'single order retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// get all order for single user
const getAllOrderByEmailForSingleCustomer: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const email = req.params.email;
    // console.log(email);
    const result =
      await OrderServices.getAllOrderByEmailForSingleCustomerFromDB(email);
    res.status(200).json({
      status: true,
      message: 'get all orders for single customers retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const OrderControllers = {
  deleteOrder,
  createOrderBike,
  calculateTotalRevenue,
  updateOrder,
  getAllOrder,
  getSingleOrder,
  getAllOrderByEmailForSingleCustomer,
  verifyPayment,
};
