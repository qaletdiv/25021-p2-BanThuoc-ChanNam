// backend/routes/addresses.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'PHARMAHUB_SECRET_KEY';
let addresses = [];

import { addresses as mockAddresses } from '../data/addresses.js';
addresses = [...mockAddresses];

// Middleware xác thực từ cookie
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const router = Router();

// GET /api/addresses → lấy địa chỉ của user
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  
  const userAddresses = addresses.filter(a => a.userId == userId);
  res.json(userAddresses);
});

// POST /api/addresses → thêm địa chỉ mới
router.post('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  
  const { recipientName, recipientPhone, fullAddress, isDefault } = req.body;

  if (!recipientName || !recipientPhone || !fullAddress) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  // Tạo địa chỉ mới
  const newAddress = {
    id: Date.now().toString(),
    userId,
    recipientName,
    recipientPhone,
    fullAddress,
    isDefault: !!isDefault
  };

  // Nếu đặt mặc định, bỏ chọn các địa chỉ khác
  if (newAddress.isDefault) {
    addresses = addresses.map(addr =>
      addr.userId === userId ? { ...addr, isDefault: false } : addr
    );
  }

  addresses.push(newAddress);
  res.status(201).json(newAddress);
});

// PUT /api/addresses/:id → cập nhật địa chỉ
router.put('/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { recipientName, recipientPhone, fullAddress, isDefault } = req.body;

  const index = addresses.findIndex(a => a.id === id && a.userId == userId);
  if (index === -1) return res.status(404).json({ message: 'Địa chỉ không tồn tại' });

  // Cập nhật
  addresses[index] = {
    ...addresses[index],
    recipientName,
    recipientPhone,
    fullAddress,
    isDefault: !!isDefault
  };

  // Nếu đặt mặc định, bỏ chọn các địa chỉ khác
  if (isDefault) {
    addresses = addresses.map(addr =>
      addr.userId === userId && addr.id !== id ? { ...addr, isDefault: false } : addr
    );
  }

  res.json(addresses[index]);
});

// DELETE /api/addresses/:id → xóa địa chỉ
router.delete('/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  
  const initialLength = addresses.length;
  addresses = addresses.filter(a => !(a.id === id && a.userId == userId));

  if (addresses.length === initialLength) {
    return res.status(404).json({ message: 'Địa chỉ không tồn tại' });
  }

  res.json({ success: true });
});

export default router;

export { authenticateJWT };