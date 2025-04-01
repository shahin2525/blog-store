import { Router } from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = Router();
router.patch(
  '/users/:userId/block',
  auth(USER_ROLE.admin),
  AdminController.blockUser,
);
router.delete(
  '/blogs/:id',
  auth(USER_ROLE.admin),
  AdminController.deleteListing,
);
export const AdminRoutes = router;
