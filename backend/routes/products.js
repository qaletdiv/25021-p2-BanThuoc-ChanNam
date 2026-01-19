// backend/routes/products.js
import { Router } from 'express';
import { products } from '../data/products.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Không tìm thấy sản phẩm!' });
  }
});

export default router;