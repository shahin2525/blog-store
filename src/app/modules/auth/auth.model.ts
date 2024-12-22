import { Schema, model, connect } from 'mongoose';
import { TLoginUser } from './auth.interface';

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<TLoginUser>({
  email: { type: String, required: true },
});

// 3. Create a Model.
export const LoginUser = model<TLoginUser>('User', userSchema);
