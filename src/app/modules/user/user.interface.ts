/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
};
export interface UserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser | null>;
}
