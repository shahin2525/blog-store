import { Router } from 'express';
// import { RequestControllers } from './request.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';
import { RequestControllers } from './request.controller';

const router = Router();

// router.get('/verify', auth(USER_ROLE.customer), RequestControllers.verifyPayment);
// router.get(
//   '/:email',
//   auth(USER_ROLE.customer),
//   RequestControllers.getAllRequestByEmailForSingleCustomer,
// );

// requestRouter.get("/verify", auth(UserRole.user), requestController.verifyPayment);

router.post(
  '/requests',
  auth(USER_ROLE.tenant),
  RequestControllers.createTenantRequest,
);
router.delete(
  '/:requestId',
  auth(USER_ROLE.admin),
  RequestControllers.deleteRequest,
);
router.put(
  '/:requestId',
  auth(USER_ROLE.admin),
  RequestControllers.updateRequest,
);
router.get(
  '/requests/:id',
  auth(USER_ROLE.admin),
  RequestControllers.getSingleRequest,
);

router.get('/', auth(USER_ROLE.admin), RequestControllers.getAllRequest);
// router.get(
//   '/requests',
//   auth(USER_ROLE.tenant),
//   RequestControllers.getAllRequest,
// );
// router.get(
//   '/requests',
//   auth(USER_ROLE.tenant),
//   RequestControllers.getAllRequestByEmailForSingleTenant,
// );

router.get(
  '/requests',
  auth(USER_ROLE.tenant),
  RequestControllers.getAllTenantRequestForSingleTenant,
);

// router.get('/revenue', RequestControllers.calculateTotalRevenue);
export const RequestRoutes = router;
