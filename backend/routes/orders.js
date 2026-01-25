// backend/routes/orders.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'pharma-hub-secret-key';
let orders = []; // Giả lập từ data/orders.js

// Load dữ liệu mẫu
import { orders as mockOrders } from '../data/orders.js';
orders = [...mockOrders];

function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

const router = Router();

// GET /api/orders → lấy đơn hàng của user
router.get('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userOrders = orders.filter(o => o.userId == userId);
  res.json(userOrders);
});

// POST /api/orders → tạo đơn hàng mới
router.post('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {
    items,
    recipientName,
    phone,
    address,
    paymentMethod,
    subtotal,
    shippingCost,
    discount,
    totalPrice
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Không có sản phẩm trong đơn hàng' });
  }

  const newOrder = {
    id: Date.now().toString(),
    userId,
    items,
    recipientName,
    phone,
    address,
    paymentMethod,
    subtotal,
    shippingCost,
    discount: discount || 0,
    totalPrice,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

export default router;