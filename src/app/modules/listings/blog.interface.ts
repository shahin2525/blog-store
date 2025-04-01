/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TListing = {
  location: string;
  description: string;
  multipleImages: string[];
  numberOfBedrooms: number;

  rentAmount: number;
  landlordID: Types.ObjectId;
};

export interface ListingModel extends Model<TListing> {
  isListingExists(id: string): Promise<TListing | null>;
}
