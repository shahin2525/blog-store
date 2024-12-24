import { JwtPayload } from 'jsonwebtoken';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';
import { User } from '../user/user.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/appError';
import mongoose from 'mongoose';

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
const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  // search

  let search = '';
  if (query?.search) {
    search = query.search as string;
  }

  const blogSearching = Blog.find({
    $or: ['title', 'content'].map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    })),
  });
  // filtering

  const queryObj = { ...query };

  const excludeFields = ['search', 'sort'];
  excludeFields.forEach((el) => delete queryObj[el]);

  if (queryObj?.filter) {
    queryObj.author = new mongoose.Types.ObjectId(queryObj.filter as string);
    delete queryObj.filter;
  }

  const filterQuery = blogSearching.find(queryObj);
  // sorting
  let sort = '-createdAt';
  if (query?.sort) {
    sort = query.sort as string;
  }
  const sortQuery = await filterQuery.sort(sort);
  // console.log(result);
  return sortQuery;
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
