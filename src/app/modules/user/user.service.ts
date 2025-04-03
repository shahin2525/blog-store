import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};
const getAllUserFromDB = async () => {
  const result = await User.find();
  return result;
};
const updateUserRoleFromDB = async (id: string, payload: Partial<TUser>) => {
  const user = await User.doesUserExists(id);
  if (!user) {
    throw new Error('user does not found');
  }
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
//
const deleteUserFromDB = async (id: string) => {
  const user = await User.doesUserExists(id);
  if (!user) {
    throw new Error('user does not found');
  }
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  updateUserRoleFromDB,
  deleteUserFromDB,
};
