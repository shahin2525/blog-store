import { Router } from 'express';

import { LoginController } from './login.controller';
import { USER_ROLE } from '../user/user.const';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/login', LoginController.loginUser);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  //   validateRequest(AuthValidation.changePasswordValidationSchema),
  LoginController.changePassword,
);

export const LoginRoutes = router;
