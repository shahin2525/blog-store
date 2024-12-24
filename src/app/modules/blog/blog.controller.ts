import { RequestHandler } from 'express';
import { BlogServices } from './blog.service';

import StatusCodes from 'http-status-codes';
const createBlog: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const userData = req.user;
    // console.log(userData);
    const result = await BlogServices.createBlogIntoDB(data, userData);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Blog created successfully',
      statusCode: StatusCodes.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// blog update
const updateBlog: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const userData = req.user;
    const id = req.params.id;
    // console.log(userData);
    const result = await BlogServices.updateBlogIntoDB(id, data, userData);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Blog updated successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// delete user

const deleteBlog: RequestHandler = async (req, res, next) => {
  try {
    const userData = req.user;
    const id = req.params.id;
    // console.log(userData);
    await BlogServices.deleteBlogFromDB(id, userData);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Blog deleted successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBlogs: RequestHandler = async (req, res, next) => {
  try {
    // console.log(req.query);
    const result = await BlogServices.getAllBlogsFromDB(req.query);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Blogs fetched successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const BlogController = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
};
