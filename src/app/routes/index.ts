import { Router } from 'express';
import { LoginRoutes } from '../modules/login/login.routes';
import { UserRoutes } from '../modules/user/user.routes';
// import { BlogRoutes } from '../modules/listings/blog.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { ListingRoutes } from '../modules/listings/blog.routes';
import { RequestRoutes } from '../modules/request/request.routes';

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
    path: '/landlords/listings/',
    route: ListingRoutes,
  },
  {
    path: '/admin/',
    route: AdminRoutes,
  },
  {
    path: '/tenant/',
    route: RequestRoutes,
  },
];

routesModule.forEach((route) => router.use(route.path, route.route));
export default router;
