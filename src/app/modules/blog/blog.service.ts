import { JwtPayload } from 'jsonwebtoken';
import { TBlog } from './blog.interface';
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

  payload.author = user?._id;
  const result = await Blog.create(payload);

  return result;
};
const getAllBlogsFromDB = async () => {
  const result = await Blog.find();
  return result;
};
const updateBlogIntoDB = async (
  id: string,
  payload: Partial<TBlog>,
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

  const isBlogAuthorMatch = blogInfo?.author.toString() !== user._id.toString();

  if (isBlogAuthorMatch) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'author does not exists this blog',
    );
  }

  const result = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deleteBlogFromDB = async (
  id: string,

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

  const isBlogAuthorMatch = blogInfo?.author.toString() !== user._id.toString();

  if (isBlogAuthorMatch) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'author does not exists this blog',
    );
  }

  const result = await Blog.findByIdAndDelete(id);

  return result;
};

export const BlogServices = {
  createBlogIntoDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
  getAllBlogsFromDB,
};
