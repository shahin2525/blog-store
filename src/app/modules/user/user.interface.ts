/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.const';

export type TUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'landlord' | 'admin' | 'tenant';
  phone?: string;
  address?: string;
  city?: string;
  deactivate: boolean;
};
export interface UserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser | null>;

  isPasswordMatch(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  doesUserExists(id: string): Promise<TUser | null>;
}
// export type TUserRole = keyof typeof USER_ROLE;
export type TUserRole = keyof typeof USER_ROLE;
