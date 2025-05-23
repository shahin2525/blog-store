import { Router } from 'express';
import { ListingController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = Router();

router.put(
  '/listings/:id',
  auth(USER_ROLE.admin, USER_ROLE.landlord),
  ListingController.updateListing,
);
router.put(
  '/requests/:id',
  auth(USER_ROLE.landlord),
  ListingController.respondRentalRequest,
);
router.delete(
  '/listings/:id',
  auth(USER_ROLE.landlord),
  ListingController.deleteListing,
);
router.post(
  '/listings/',
  auth(USER_ROLE.landlord),
  ListingController.createListing,
);
router.get(
  '/listings',
  auth(USER_ROLE.landlord),
  ListingController.getAllListingForSingleLandlord,
);
router.get(
  '/all/listings',

  ListingController.getAllListings,
);

router.get(
  '/listings/:id',

  ListingController.getSingleListingIntoDB,
);

router.get(
  '/requests',
  auth(USER_ROLE.landlord),
  ListingController.getAllRentalListingRequestForSingleLandlord,
);
export const ListingRoutes = router;
