import { model, Schema } from 'mongoose';
import { OrderModel, TOrder } from './order.interface';

const OrderSchema = new Schema<TOrder, OrderModel>(
  {
    email: { type: String, required: [true, 'email is required'] },
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'listing is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'quantity is required'],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: [true, 'total price is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
  },
  {
    timestamps: true,
  },
);

// 3. Create a Model.
OrderSchema.statics.isOrderExists = async function (id: string) {
  const isOrderExists = await Order.findById(id);
  return isOrderExists;
};
// 3. Create a Model.

export const Order = model<TOrder, OrderModel>('Order', OrderSchema);
