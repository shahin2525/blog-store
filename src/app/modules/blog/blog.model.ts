import { model, Schema } from 'mongoose';
import { BlogModel, TBlog } from './blog.interface';

const blogSchema = new Schema<TBlog, BlogModel>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);
blogSchema.statics.isBlogExists = async function (id: string) {
  const isBlogExists = await Blog.findById(id);
  return isBlogExists;
};
// 3. Create a Model.
export const Blog = model<TBlog, BlogModel>('Blog', blogSchema);
