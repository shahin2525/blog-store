import { Model, Types } from 'mongoose';

export type TOrder = {
  email: string;
  listing: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled';
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};

export interface OrderModel extends Model<TOrder> {
  // eslint-disable-next-line no-unused-vars
  isOrderExists(id: string): Promise<TOrder | null>;
}
