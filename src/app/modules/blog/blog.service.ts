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
  const filter: Record<string, unknown> = {};
  const { search, sortBy, ...otherFilters } = query;

  // Search logic (partial match for title or content)
  if (search) {
    const searchRegex = { $regex: search as string, $options: 'i' };
    filter.$or = [{ title: searchRegex }, { content: searchRegex }];
  }

  // Exact match filters
  Object.keys(otherFilters).forEach((key) => {
    if (key === 'author') {
      // Convert to ObjectId for author filtering
      filter[key] = new mongoose.Types.ObjectId(otherFilters[key] as string);
    } else {
      filter[key] = { $regex: otherFilters[key], $options: 'i' };
    }
  });

  // Default sort by newest blogs first

  const sort = sortBy ? (sortBy as string) : '-createdAt';

  const result = await Blog.find(filter).sort(sort);

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

/*
const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  // Extract search and filter fields
  const { search, ...otherFilters } = query;

  // Apply search on title or content
  if (search) {
    const searchRegex = { $regex: search as string, $options: 'i' };
    filter.$or = [
      { title: searchRegex },
      { content: searchRegex }
    ];
  }

  // Apply exact match filters (like title, author)
  Object.keys(otherFilters).forEach((key) => {
    if (key === 'author') {
      // Convert author to ObjectId
      filter[key] = new mongoose.Types.ObjectId(otherFilters[key] as string);
    } else {
      // Direct filter for other fields
      filter[key] = otherFilters[key];
    }
  });

  console.log('Final Filter:', filter); // Debugging

  // Fetch data with dynamic filter
  const result = await Blog.find(filter).sort('-createdAt');

  return result;
};
*/
