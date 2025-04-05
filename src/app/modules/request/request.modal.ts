import { model, Schema } from 'mongoose';
import { RequestModel, TRequest } from './request.interface';

const RequestSchema = new Schema<TRequest, RequestModel>(
  {
    listingID: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'listingID is required'],
    },
    tenantID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tenant user is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'approve', 'reject'], // Changed to match interface
      default: 'Pending',
    },
    landlordPhoneNumber: {
      type: String,
      required: false, // Optional as per interface
    },
  },
  // transaction: {
  //   id: String,
  //   transactionStatus: String,
  //   bank_status: String,
  //   sp_code: String,
  //   sp_message: String,
  //   method: String,
  //   date_time: String,
  // },
  {
    timestamps: true,
  },
);

// 3. Create a Model.
RequestSchema.statics.isRequestExists = async function (id: string) {
  const isRequestExists = await Request.findById(id);
  return isRequestExists;
};
// 3. Create a Model.

export const Request = model<TRequest, RequestModel>('Request', RequestSchema);
