import { Router } from 'express';
import { LoginRoutes } from '../modules/login/login.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { BlogRoutes } from '../modules/blog/blog.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';

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
    path: '/blogs/',
    route: BlogRoutes,
  },
  {
    path: '/admin/',
    route: AdminRoutes,
  },
];

routesModule.forEach((route) => router.use(route.path, route.route));
export default router;
