import { Router } from 'express';
import {
  getCategories,
  createCategory,
} from '../controllers/category.controller.js';

const router = Router();

// /api/categories
router.route('/').get(getCategories).post(createCategory);

export default router;