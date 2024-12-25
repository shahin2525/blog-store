// import mongoose from 'mongoose';
import { z } from 'zod';

const userValidationSchema = z.object({
  //   _id: z.instanceof(mongoose.Types.ObjectId), // ObjectId validation
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.enum(['user', 'admin']),
  isBlocked: z.boolean(),
});

export const UserValidations = {
  userValidationSchema,
};
