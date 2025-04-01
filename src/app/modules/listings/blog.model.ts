import { model, Schema } from 'mongoose';
import { ListingModel, TListing } from './blog.interface';

const listingSchema = new Schema<TListing, ListingModel>(
  {
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    multipleImages: {
      type: [String], // Array of strings
      required: true,
    },
    numberOfBedrooms: {
      type: Number,
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
    },
    landlordID: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming this refers to a User model
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);
listingSchema.statics.isListingExists = async function (id: string) {
  const isListingExists = await Listing.findById(id);
  return isListingExists;
};
// 3. Create a Model.
export const Listing = model<TListing, ListingModel>('Listing', listingSchema);
