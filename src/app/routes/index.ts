import { Router } from 'express';
import { LoginRoutes } from '../modules/login/login.routes';
import { UserRoutes } from '../modules/user/user.routes';
// import { BlogRoutes } from '../modules/listings/blog.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { ListingRoutes } from '../modules/listings/blog.routes';
import { RequestRoutes } from '../modules/request/request.routes';
import { OrderRoutes } from '../modules/order/order.routes';

const router = Router();

const routesModule = [
  {
    path: '/auth/',
    route: LoginRoutes,
  },
  {
    path: '/auth/',
    route: UserRoutes,
  },
  {
    path: '/landlords/',
    route: ListingRoutes,
  },
  {
    path: '/admin/',
    route: AdminRoutes,
  },
  {
    path: '/tenants',
    route: RequestRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

routesModule.forEach((route) => router.use(route.path, route.route));
export default router;
