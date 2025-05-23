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

// const refreshTokenValidationSchema = z.object({
//   refreshToken: z.string({
//     required_error: 'Refresh token is required!',
//   }),
// });
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const userProfileValidationSchema = z.object({
  email: z.string({ required_error: 'email is required' }).email().optional(),
  name: z.string({ required_error: 'name is required' }).optional(),
});

export const LoginValidations = {
  loginUserValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  userProfileValidationSchema,
};
