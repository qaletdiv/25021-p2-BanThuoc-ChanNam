// backend/routes/categories.js
import { Router } from 'express';
import { categories } from '../data/categories.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(categories);
});

export default router;