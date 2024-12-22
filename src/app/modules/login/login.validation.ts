import { z } from 'zod';

const loginUserValidationSchema = z.object({
  email: z.string({ required_error: 'email is required' }),
  password: z.string({ required_error: 'password is required' }),
});

export const LoginValidations = {
  loginUserValidationSchema,
};
