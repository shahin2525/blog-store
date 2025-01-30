import { z } from 'zod';

const loginUserValidationSchema = z.object({
  email: z.string({ required_error: 'email is required' }),
  password: z.string({ required_error: 'password is required' }),
});
const changePasswordValidationSchema = z.object({
  oldPassword: z.string({
    required_error: 'Old password is required',
  }),
  newPassword: z.string({ required_error: 'Password is required' }),
});
export const LoginValidations = {
  loginUserValidationSchema,
  changePasswordValidationSchema,
};
