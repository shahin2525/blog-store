import { TBlog } from './blog.interface';
import { model, Schema } from 'mongoose';

const blogSchema = new Schema<TBlog>(
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
// 3. Create a Model.
export const Blog = model<TBlog>('Blog', blogSchema);
