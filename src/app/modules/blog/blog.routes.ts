import { Router } from 'express';
import { BlogController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = Router();

router.post('/', auth(USER_ROLE.user), BlogController.createBlog);
export const BlogRoutes = router;
