import { RequestHandler } from 'express';
import { BlogServices } from './blog.service';

import StatusCodes from 'http-status-codes';
const createBlog: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await BlogServices.createBlogIntoDB(data);
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
export const BlogController = {
  createBlog,
};
