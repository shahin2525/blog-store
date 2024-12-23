/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TBlog = {
  title: string;
  content: string;
  author: Types.ObjectId;
  isPublished: boolean;
};

export interface BlogModel extends Model<TBlog> {
  isBlogExists(id: string): Promise<TBlog | null>;
}
