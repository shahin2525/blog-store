import { Router } from 'express';
import { BlogController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.const';

const router = Router();

router.patch('/:id', auth(USER_ROLE.user), BlogController.updateBlog);
router.delete('/:id', auth(USER_ROLE.user), BlogController.deleteBlog);
router.post('/', auth(USER_ROLE.user), BlogController.createBlog);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  BlogController.getAllBlogs,
);
export const BlogRoutes = router;
