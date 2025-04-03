import { Router } from 'express';
import { ListingController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = Router();

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.landlord),
  ListingController.updateListing,
);
router.delete(
  '/:id',
  auth(USER_ROLE.landlord),
  ListingController.deleteListing,
);
router.post('/', auth(USER_ROLE.landlord), ListingController.createListing);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.landlord),
  ListingController.getAllListings,
);
export const ListingRoutes = router;
