import { JwtPayload } from 'jsonwebtoken';
import { TBlog, TBlogUpdate } from './blog.interface';
import { Blog } from './blog.model';
import { User } from '../user/user.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/appError';

const createBlogIntoDB = async (payload: TBlog, userData: JwtPayload) => {
  const { data } = userData;
  const { email } = data;
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user is not found');
  }
  const isBlocked = user.isBlocked;
  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'you user is blocked');
  }
  // console.log(user);
  payload.author = user?._id;
  const result = await Blog.create(payload);
  // console.log(result);
  return result;
};

const updateBlogIntoDB = async (
  id: string,
  payload: TBlogUpdate,
  userData: JwtPayload,
) => {
  const { data } = userData;
  const { email } = data;
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'user is not found');
  }
  const isBlocked = user.isBlocked;
  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'you user is blocked');
  }

  const blogInfo = await Blog.findById(id);
  const isBlogAuthorMatch = blogInfo?.author === user._id;
  if (!isBlogAuthorMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'auth and blog does not match');
  }
  // console.log(user);
  // payload.author = user?._id;
  const result = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
  });
  // console.log(result);
  return result;
};

export const BlogServices = {
  createBlogIntoDB,
  updateBlogIntoDB,
};
