import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.post('/auth/register', UserController.createUser);
export const UserRoutes = router;
