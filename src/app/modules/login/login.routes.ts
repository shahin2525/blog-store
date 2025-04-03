import { Router } from 'express';

import { LoginController } from './login.controller';
import { USER_ROLE } from '../user/user.const';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/login', LoginController.loginUser);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.landlord, USER_ROLE.tenant),
  //   validateRequest(AuthValidation.changePasswordValidationSchema),
  LoginController.changePassword,
);

router.post(
  '/refresh-token',
  // validateRequest(AuthValidation.refreshTokenValidationSchema),
  LoginController.refreshToken,
);
export const LoginRoutes = router;
