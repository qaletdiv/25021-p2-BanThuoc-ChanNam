// backend/routes/orders.js
import { Router } from 'express';
import { authenticateJWT } from './auth.js'; 

const router = Router();

// In-memory orders storage (giả lập database)
let orders = [];

// Load dữ liệu mẫu (nếu có)
import { orders as mockOrders } from '../data/orders.js';
orders = [...mockOrders];

// GET /api/orders → lấy tất cả đơn hàng (admin) hoặc của user hiện tại
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let responseOrders;

  if (userRole === 'admin') {
    // Admin: thấy tất cả đơn hàng
    responseOrders = orders;
  } else {
    // User thường: chỉ thấy đơn hàng của mình
    responseOrders = orders.filter(order => order.userId == userId);
  }

  // Sắp xếp theo ngày tạo mới nhất
  const sortedOrders = responseOrders.sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.json(sortedOrders);
});

// GET /api/orders/:id → lấy chi tiết đơn hàng cụ thể
router.get('/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const orderId = req.params.id;

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy đơn hàng'
    });
  }

  // Admin có thể xem bất kỳ đơn hàng nào
  // User thường chỉ được xem đơn hàng của mình
  if (userRole !== 'admin' && order.userId != userId) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền xem đơn hàng này'
    });
  }

  res.json({
    success: true,
    order
  });
});

// POST /api/orders → tạo đơn hàng mới
router.post('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const orderData = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Giỏ hàng không có sản phẩm nào'
    });
  }

  if (!orderData.recipientName || !orderData.phone || !orderData.address) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ thông tin nhận hàng'
    });
  }

  // Tạo đơn hàng mới
  const newOrder = {
    id: `ORD${Date.now()}`,
    userId: userId,
    userEmail: req.user.email,
    userName: req.user.name,
    items: orderData.items,
    recipientName: orderData.recipientName,
    phone: orderData.phone,
    address: orderData.address,
    paymentMethod: orderData.paymentMethod || 'cod',
    subtotal: orderData.subtotal || 0,
    shippingCost: orderData.shippingCost || 0,
    totalPrice: orderData.totalPrice || 0,
    status: 'pending', // Trạng thái mặc định
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Thêm vào danh sách đơn hàng
  orders.push(newOrder);

  res.status(201).json({
    success: true,
    message: 'Đặt hàng thành công',
    orderId: newOrder.id,
    order: newOrder
  });
});

// PUT /api/orders/:id/cancel → hủy đơn hàng (chỉ user thường mới được hủy đơn của mình)
router.put('/:id/cancel', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const orderId = req.params.id;

  const orderIndex = orders.findIndex(o => o.id === orderId && o.userId == userId);

  if (orderIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy đơn hàng'
    });
  }

  // Admin không thể hủy đơn hàng của người khác
  // User thường: chỉ hủy đơn của mình
  if (userRole !== 'admin' && orders[orderIndex].status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận'
    });
  }

  orders[orderIndex].status = 'cancelled';
  orders[orderIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Đã hủy đơn hàng',
    order: orders[orderIndex]
  });
});

// PUT /api/orders/:id/status → cập nhật trạng thái đơn hàng (chỉ admin)
router.put('/:id/status', authenticateJWT, (req, res) => {
  const userRole = req.user.role;
  const orderId = req.params.id;
  const { status } = req.body;

  // Chỉ admin mới được cập nhật trạng thái
  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Chỉ quản trị viên mới được cập nhật trạng thái đơn hàng' });
  }

  const orderIndex = orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }

  // Kiểm tra trạng thái hợp lệ
  const validStatuses = ['pending', 'processing', 'shipping', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Cập nhật trạng thái đơn hàng thành công',
    order: { ...orders[orderIndex] }
  });
});


export default router;