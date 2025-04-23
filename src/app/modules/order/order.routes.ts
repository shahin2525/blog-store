import { Router } from 'express';
import { OrderControllers } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = Router();
router.get('/verify', auth(USER_ROLE.tenant), OrderControllers.verifyPayment);
router.get(
  '/:email',
  auth(USER_ROLE.tenant),
  OrderControllers.getAllOrderByEmailForSingleCustomer,
);
// orderRouter.get("/verify", auth(UserRole.user), orderController.verifyPayment);

router.post('/', auth(USER_ROLE.tenant), OrderControllers.createOrderBike);
router.delete('/:orderId', auth(USER_ROLE.admin), OrderControllers.deleteOrder);
router.put('/:orderId', auth(USER_ROLE.admin), OrderControllers.updateOrder);
router.get('/:orderId', auth(USER_ROLE.admin), OrderControllers.getSingleOrder);

router.get('/', auth(USER_ROLE.admin), OrderControllers.getAllOrder);
router.get(
  '/all',
  auth(USER_ROLE.tenant),
  OrderControllers.getAllOrderByEmailForSingleCustomer,
);

router.get('/revenue', OrderControllers.calculateTotalRevenue);
export const OrderRoutes = router;
