import { Router } from 'express';
import { ListingController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = Router();

router.patch('/:id', auth(USER_ROLE.user), ListingController.updateListing);
router.delete('/:id', auth(USER_ROLE.user), ListingController.deleteListing);
router.post('/', auth(USER_ROLE.user), ListingController.createListing);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  ListingController.getAllListings,
);
export const ListingRoutes = router;
