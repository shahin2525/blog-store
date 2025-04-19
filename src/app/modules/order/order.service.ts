import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/appError';
// import { Listing } from '../bike/bike.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { User } from '../user/user.model';
import { orderUtils } from './order.utils';
import { Listing } from '../listings/blog.model';

const createOrderListingIntoDB = async (
  userEmail: string,
  payload: TOrder,
  client_ip: string,
) => {
  const user = await User.isUserExists(userEmail);
  // console.log(user);
  const findRentalListing = await Listing.findById(payload.listing);

  if (!findRentalListing) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Listing  is not found');
  }
  // const productQuantity = findProductData?.quantity;

  // const payLoadQuantity = payload?.quantity;

  // if (productQuantity < payLoadQuantity) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, 'insufficient stock');
  // }
  // const productStock = findProductData.stock;
  // if (!productStock) {
  //   throw new AppError(
  //     StatusCodes.BAD_REQUEST,
  //     'Listing stock does not available',
  //   );
  // }
  // const newProductQuantity = productQuantity - payload.quantity;

  // add  inStock false if product quantity <=0
  // if (newProductQuantity <= 0) {
  //   await Listing.findByIdAndUpdate(
  //     payload.product,
  //     { stock: false },
  //     { new: true, runValidators: true },
  //   );
  // }

  // new quantity updated
  // await Listing.findByIdAndUpdate(
  //   payload.product,
  //   { quantity: newProductQuantity },
  //   { new: true, runValidators: true },
  // );

  // console.log(payload);

  const totalPrice = findRentalListing?.rentAmount * payload.quantity;

  // console.log(totalPrice);
  let order = await Order.create({
    email: payload.email,
    listing: payload.listing,
    quantity: payload.quantity,
    totalPrice,
  });
  // console.log(order);

  const shurjopayPayload = {
    amount: totalPrice,

    order_id: order._id,
    currency: 'BDT',
    customer_name: user?.name,
    customer_address: user?.address,
    customer_email: user?.email,
    customer_phone: user?.phone,
    customer_city: user?.city,
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const calculateRevenueFromDB = async () => {
  const allOrdersRevenue = await Order.aggregate([
    {
      $project: {
        revenue: '$totalPrice',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$revenue' },
      },
    },
    {
      $project: { _id: 0 },
    },
  ]);
  if (allOrdersRevenue.length > 0) {
    return allOrdersRevenue;
  } else {
    return 0;
  }
};
const deleteOrderFromDB = async (id: string) => {
  if (!(await Order.isOrderExists(id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'order id not found');
  }

  const result = await Order.findByIdAndDelete(id);
  return result;
};

const updateOrderFromDB = async (id: string, data: Partial<TOrder>) => {
  if (!(await Order.isOrderExists(id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'order id  not found');
  }
  const result = await Order.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return result;
};
const getAllOrderFromDB = async () => {
  const result = await Order.find();
  return result;
};

// payment verify
const verifyPayment = async (order_id: string) => {
  // console.log(order_id);
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }

  return verifiedPayment;
};

const getSingleOrderFromDB = async (id: string) => {
  if (!(await Order.isOrderExists(id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'order id not found');
  }

  const result = await Order.findById(id);
  return result;
};
const getAllOrderByEmailForSingleCustomerFromDB = async (email: string) => {
  const result = await Order.find({ email });
  return result;
};
export const OrderServices = {
  createOrderListingIntoDB,
  calculateRevenueFromDB,
  deleteOrderFromDB,
  updateOrderFromDB,
  getSingleOrderFromDB,
  getAllOrderFromDB,
  getAllOrderByEmailForSingleCustomerFromDB,
  verifyPayment,
};
