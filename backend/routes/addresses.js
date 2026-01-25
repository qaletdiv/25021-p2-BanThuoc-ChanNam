// backend/routes/addresses.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'pharma-hub-secret-key';
let addresses = []; // Giả lập từ data/addresses.js

// Helper: load dữ liệu mẫu (nếu cần)
import { addresses as mockAddresses } from '../data/addresses.js';
addresses = [...mockAddresses];

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

// GET /api/addresses → lấy địa chỉ của user
router.get('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userAddresses = addresses.filter(a => a.userId == userId);
  res.json(userAddresses);
});

// POST /api/addresses → thêm địa chỉ mới
router.post('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

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
router.put('/:id', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

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
router.delete('/:id', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.params;
  const initialLength = addresses.length;
  addresses = addresses.filter(a => !(a.id === id && a.userId == userId));

  if (addresses.length === initialLength) {
    return res.status(404).json({ message: 'Địa chỉ không tồn tại' });
  }

  res.json({ success: true });
});

export default router;