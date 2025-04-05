import { Model, Types } from 'mongoose';

export type TRequest = {
  listingID: Types.ObjectId;
  tenantID: Types.ObjectId;
  //   quantity: number;
  //   totalPrice: number;
  status: 'Pending' | 'approve' | 'reject';
  landlordPhoneNumber?: string;
  //   transaction: {
  //     id: string;
  //     transactionStatus: string;
  //     bank_status: string;
  //     sp_code: string;
  //     sp_message: string;
  //     method: string;
  //     date_time: string;
  //   };
};

export interface RequestModel extends Model<TRequest> {
  // eslint-disable-next-line no-unused-vars
  isRequestExists(id: string): Promise<TRequest | null>;
}
