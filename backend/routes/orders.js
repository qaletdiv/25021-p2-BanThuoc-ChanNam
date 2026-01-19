// backend/routes/orders.js
import { Router } from 'express';
import { orders } from '../data/orders.js';

const router = Router();

router.get('/', (req, res) => {
  const userId = req.query.userId;
  if (userId) {
    const userOrders = orders.filter(o => o.userId == userId);
    return res.json(userOrders);
  }
  res.json(orders);
});

router.post('/', (req, res) => {
  const newOrder = { ...req.body, id: Date.now().toString() };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

export default router;