// backend/routes/cart.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { products } from '../data/products.js';

const JWT_SECRET = 'pharma-hub-secret-key';
const carts = {}; // In-memory: carts[userId] = [items]

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

// GET /api/cart → lấy giỏ hàng của user
router.get('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.json(carts[userId] || []);
});

// POST /api/cart → thêm sản phẩm vào giỏ
router.post('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { productId, unit, quantity } = req.body;

  // Validate input
  if (!productId || !unit || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
  }

  // Kiểm tra sản phẩm tồn tại
  const product = products.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
  }

  // Kiểm tra đơn vị hợp lệ
  const validUnit = product.units.find(u => u.name === unit);
  if (!validUnit) {
    return res.status(400).json({ message: 'Đơn vị không hợp lệ' });
  }

  // Khởi tạo giỏ nếu chưa có
  if (!carts[userId]) carts[userId] = [];

  // Kiểm tra trùng lặp
  const existingItem = carts[userId].find(
    item => item.productId === productId && item.unit === unit
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].push({
      id: Date.now().toString(),
      productId,
      unit,
      quantity,
      price: validUnit.price // ← Lấy từ server, không tin tưởng client
    });
  }

  res.status(201).json({ success: true });
});

// PUT /api/cart/:id → cập nhật số lượng
router.put('/:id', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.params;
  const { quantity } = req.body;

  if (!carts[userId]) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

  const itemIndex = carts[userId].findIndex(item => item.id === id);
  if (itemIndex === -1) return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });

  if (quantity <= 0) {
    carts[userId].splice(itemIndex, 1);
  } else {
    carts[userId][itemIndex].quantity = quantity;
  }

  res.json({ success: true });
});

// DELETE /api/cart/:id → xóa sản phẩm
router.delete('/:id', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const userId = getUserIdFromToken(token);

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.params;
  if (!carts[userId]) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

  carts[userId] = carts[userId].filter(item => item.id !== id);
  res.json({ success: true });
});

export default router;