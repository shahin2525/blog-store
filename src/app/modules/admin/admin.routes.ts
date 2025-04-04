import { Router } from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';
import { UserController } from '../user/user.controller';
import { ListingController } from '../listings/blog.controller';

const router = Router();
router.patch(
  '/users/:userId/block',
  auth(USER_ROLE.admin),
  AdminController.blockUser,
);

router.delete(
  '/listings/:id',
  auth(USER_ROLE.admin),
  AdminController.deleteListing,
);

router.put('/users/:id', auth(USER_ROLE.admin), UserController.updateUserRole);
router.delete('/user/:id', auth(USER_ROLE.admin), UserController.deleteUser);
router.put(
  '/listings/:id',
  auth(USER_ROLE.admin),
  ListingController.updateListing,
);
router.get('/users/', auth(USER_ROLE.admin), UserController.getAllUser);
router.get(
  '/listings',
  auth(USER_ROLE.admin),
  ListingController.getAllListings,
);
export const AdminRoutes = router;
