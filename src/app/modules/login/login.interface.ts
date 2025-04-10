import { Types } from 'mongoose';

export type TLoginUser = {
  email: string;
  password: string;
};
export type TProfileUpdateData = {
  name?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
};
export interface IJwtPayload {
  userId: Types.ObjectId;
  name: string;
  email: string;

  role: 'landlord' | 'admin' | 'tenant';
  isActive?: boolean;
}
