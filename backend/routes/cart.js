// backend/routes/cart.js
import { Router } from 'express';
import { authenticateJWT } from './auth.js'; // Import middleware
import { products } from '../data/products.js';

const carts = {}; // In-memory storage: carts[userId] = [items]

const router = Router();

// GET /api/cart → lấy giỏ hàng với thông tin sản phẩm đầy đủ
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.id; // Lấy từ middleware authenticateJWT

  const userCart = carts[userId] || [];
  
  // Thêm thông tin sản phẩm đầy đủ vào mỗi item
  const cartWithProductInfo = userCart.map(item => {
    const product = products.find(p => p.id === parseInt(item.productId));
    
    if (!product) {
      // Nếu không tìm thấy sản phẩm, trả về thông tin cơ bản
      return {
        ...item,
        productName: `Sản phẩm ${item.productId}`,
        productImage: '/images/no-image.png',
        productCategory: 'Không xác định'
      };
    }
    
    // Tìm giá từ product units để đảm bảo đúng
    const productUnit = product.units?.find(u => u.name === item.unit);
    const actualPrice = productUnit ? productUnit.price : item.price;
    
    return {
      ...item,
      // Thông tin sản phẩm
      productName: product.name,
      productImage: product.image || '/images/no-image.png',
      productCategory: product.category,
      productType: product.type,
      productManufacturer: product.manufacturer,
      // Cập nhật giá từ product
      price: actualPrice
    };
  });

  res.json(cartWithProductInfo);
});

// POST /api/cart → thêm sản phẩm vào giỏ
router.post('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;
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

  // Kiểm tra trùng lặp (cùng productId VÀ cùng unit)
  const existingItem = carts[userId].find(
    item => item.productId === productId && item.unit === unit
  );

  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    carts[userId].push({
      id: Date.now().toString(),
      productId,
      unit,
      quantity: parseInt(quantity),
      price: validUnit.price // ← Lấy từ server, không tin tưởng client
    });
  }

  res.status(201).json({ 
    success: true,
    message: 'Đã thêm vào giỏ hàng'
  });
});

// PUT /api/cart/:id → cập nhật số lượng
router.put('/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;

  if (!carts[userId]) {
    return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
  }

  const itemIndex = carts[userId].findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Sản phẩm không tìm thấy trong giỏ hàng' });
  }

  if (quantity <= 0) {
    carts[userId].splice(itemIndex, 1);
  } else {
    carts[userId][itemIndex].quantity = parseInt(quantity);
  }

  res.json({ 
    success: true,
    message: 'Đã cập nhật giỏ hàng'
  });
});

// DELETE /api/cart/:id → xóa sản phẩm
router.delete('/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (!carts[userId]) {
    return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
  }

  const initialLength = carts[userId].length;
  carts[userId] = carts[userId].filter(item => item.id !== id);
  
  if (carts[userId].length === initialLength) {
    return res.status(404).json({ message: 'Sản phẩm không tìm thấy trong giỏ hàng' });
  }

  res.json({ 
    success: true,
    message: 'Đã xóa sản phẩm khỏi giỏ hàng'
  });
});

// DELETE /api/cart → xóa toàn bộ giỏ hàng
router.delete('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  
  if (carts[userId]) {
    delete carts[userId];
  }

  res.json({ 
    success: true,
    message: 'Đã xóa toàn bộ giỏ hàng'
  });
});

export default router;