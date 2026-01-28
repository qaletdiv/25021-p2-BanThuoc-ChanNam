// backend/routes/users.js
import { Router } from 'express';
import { users } from '../data/users.js';

// Middleware xác thực từ cookie (giống như trong auth.js)
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'PHARMAHUB_SECRET_KEY';

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.access_token; // ← Đọc từ cookie
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; // req.user.id
    next();
  });
};

const router = Router();

// GET /api/users → lấy tất cả users (dành cho admin)
router.get('/', authenticateJWT, (req, res) => {
  // Chỉ admin mới được xem tất cả
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json(users);
});

// GET /api/users/:id → lấy user theo ID
router.get('/:id', authenticateJWT, (req, res) => {
  const userId = parseInt(req.params.id);
  const requestingUserId = req.user.id; // ID của user đang đăng nhập

  // Chỉ cho phép xem thông tin của chính mình
  if (requestingUserId != userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const user = users.find(u => u.id === userId);
  if (user) {
    // Không trả về password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// PUT /api/users/:id → cập nhật thông tin user
router.put('/:id', authenticateJWT, (req, res) => {
  const userId = parseInt(req.params.id);
  const requestingUserId = req.user.id; // ID của user đang đăng nhập

  // Chỉ cho phép cập nhật thông tin của chính mình
  if (requestingUserId != userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  // Kiểm tra email hợp lệ
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }

  // Kiểm tra số điện thoại hợp lệ (Vietnam)
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
  }

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Cập nhật thông tin
  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    phone
  };


  const { password, ...updatedUser } = users[userIndex];
  res.json(updatedUser);
});

export default router;