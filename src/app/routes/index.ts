import { Router } from 'express';
import { LoginRoutes } from '../modules/login/login.routes';
import { UserRoutes } from '../modules/user/user.routes';

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
];

routesModule.forEach((route) => router.use(route.path, route.route));
export default router;
