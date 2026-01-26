// backend/routes/orders.js
import { Router } from 'express';
import { authenticateJWT } from './auth.js'; // Import middleware

const router = Router();

// In-memory orders storage (giả lập database)
let orders = [];

// Load dữ liệu mẫu
import { orders as mockOrders } from '../data/orders.js';
orders = [...mockOrders];

// GET /api/orders → lấy tất cả đơn hàng của user hiện tại
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.id; // Lấy từ middleware
  
  const userOrders = orders.filter(order => order.userId == userId);
  
  // Sắp xếp theo ngày mới nhất
  const sortedOrders = userOrders.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  res.json(sortedOrders);
});

// GET /api/orders/:id → lấy chi tiết đơn hàng cụ thể
router.get('/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  
  const order = orders.find(o => o.id === orderId && o.userId == userId);
  
  if (!order) {
    return res.status(404).json({ 
      success: false,
      message: 'Không tìm thấy đơn hàng' 
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
  
  const {
    items,
    recipientName,
    phone,
    address,
    paymentMethod,
    subtotal,
    shippingCost,
    discount = 0,
    totalPrice,
    note = ''
  } = req.body;

  // Validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ 
      success: false,
      message: 'Không có sản phẩm trong đơn hàng' 
    });
  }

  if (!recipientName || !phone || !address || !paymentMethod) {
    return res.status(400).json({ 
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin giao hàng' 
    });
  }

  // Validate phone format (Vietnam)
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      success: false,
      message: 'Số điện thoại không hợp lệ' 
    });
  }

  // Tạo mã đơn hàng ngẫu nhiên
  const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DH${timestamp}${random}`;
  };

  const newOrder = {
    id: generateOrderId(), // Sử dụng mã đơn hàng format đẹp hơn
    userId,
    items: items.map(item => ({
      ...item,
      total: item.price * item.quantity
    })),
    recipientName,
    phone,
    address,
    paymentMethod,
    subtotal,
    shippingCost,
    discount,
    totalPrice,
    note,
    status: 'pending', // pending → confirmed → shipping → delivered → cancelled
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid', // COD: chờ thanh toán, Bank: đã thanh toán
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.push(newOrder);
  
  console.log(`New order created: ${newOrder.id} for user ${userId}`);
  console.log(`Total orders: ${orders.length}`);

  res.status(201).json({
    success: true,
    message: 'Đặt hàng thành công',
    orderId: newOrder.id,
    order: newOrder
  });
});

// PUT /api/orders/:id/cancel → hủy đơn hàng
router.put('/:id/cancel', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  
  const orderIndex = orders.findIndex(o => o.id === orderId && o.userId == userId);
  
  if (orderIndex === -1) {
    return res.status(404).json({ 
      success: false,
      message: 'Không tìm thấy đơn hàng' 
    });
  }
  
  // Chỉ cho phép hủy đơn hàng ở trạng thái pending
  if (orders[orderIndex].status !== 'pending') {
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

// PUT /api/orders/:id/status (admin only)
// router.put('/:id/status', authenticateJWT, (req, res) => {
//   const userId = req.user.id;
//   const userRole = req.user.role;
  
//   // Chỉ admin mới có quyền thay đổi trạng thái
//   if (userRole !== 'admin') {
//     return res.status(403).json({ message: 'Không có quyền truy cập' });
//   }
  
//   const orderId = req.params.id;
//   const { status } = req.body;
  
//   const orderIndex = orders.findIndex(o => o.id === orderId);
//   if (orderIndex === -1) {
//     return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
//   }
  
//   const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
//   }
  
//   orders[orderIndex].status = status;
//   orders[orderIndex].updatedAt = new Date().toISOString();
  
//   res.json({ 
//     success: true, 
//     message: 'Đã cập nhật trạng thái đơn hàng',
//     order: orders[orderIndex]
//   });
// });

export default router;