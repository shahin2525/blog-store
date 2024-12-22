import { Router } from 'express';
import { BlogController } from './blog.controller';

const router = Router();

router.post('/', BlogController.createBlog);
export const BlogRoutes = router;
