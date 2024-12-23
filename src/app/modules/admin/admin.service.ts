import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { Blog } from '../blog/blog.model';

const blockUserFromDB = async (id: string) => {
  const user = await User.doesUserExists(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user does not found');
  }
  const userStatusBlocked = user.isBlocked;
  if (userStatusBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'user is already blocked ');
  }
  const result = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true, runValidators: true },
  );
  return result;
};

const deleteBlogFromDB = async (id: string) => {
  const blog = await Blog.isBlogExists(id);
  if (!blog) {
    throw new AppError(StatusCodes.NOT_FOUND, 'blog does not found');
  }
  //   const userStatusBlocked = user.isBlocked;
  //   if (userStatusBlocked) {
  //     throw new AppError(StatusCodes.BAD_REQUEST, 'user is already blocked ');
  //   }
  const result = await Blog.findByIdAndDelete(id);
  return result;
};
export const AdminServices = {
  blockUserFromDB,
  deleteBlogFromDB,
};
