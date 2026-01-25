// backend/routes/auth.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../data/users.js';

const JWT_SECRET = 'pharma-hub-secret-key'; // ← Thay bằng biến môi trường trong production

const router = Router();

// POST /api/auth/register → đăng ký user mới
router.post('/register', (req, res) => {
  const { fullname, email, phone, password, confirmPassword } = req.body;

  console.log('Register request received:', { fullname, email, phone });

  // Validation
  if (!fullname || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Mật khẩu không khớp' });
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }

  // Check phone format (Vietnam)
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email đã được sử dụng' });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name: fullname,
    email,
    phone,
    password, // LƯU Ý: Trong thực tế nên hash password!
    role: 'user',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  console.log('New user created:', newUser.id, newUser.email);
  console.log('Total users:', users.length);

  // Tạo JWT token (auto login sau register)
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công!',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// POST /api/auth/login → trả JWT
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
  }

  // Tạo JWT (chỉ chứa thông tin cần thiết)
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    }
  });
});

// GET /api/auth/me → yêu cầu header Authorization
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) throw new Error('User not found');

    res.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(401).json({ authenticated: false });
  }
});

// POST /api/auth/logout → không cần xóa gì (JWT stateless)
router.post('/logout', (req, res) => {
  // JWT không thể revoke → client chỉ cần xóa token
  res.json({ success: true });
});

export default router;