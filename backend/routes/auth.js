// backend/routes/auth.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../data/users.js';

const JWT_SECRET = 'PHARMAHUB_SECRET_KEY';

const router = Router();

// ✅ Thêm middleware authenticateJWT
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.access_token; // ← Đọc từ cookie

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

// POST /api/auth/login → đăng nhập
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
  }

  const accessToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role || 'user' 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );

  // Gửi token qua cookie
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    path: '/',
  });

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    }
  });
});

// POST /api/auth/register → đăng ký
router.post('/register', (req, res) => {
  const { fullname, email, phone, password, confirmPassword } = req.body;

  if (!fullname || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Mật khẩu không khớp' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email đã được sử dụng' }); 
  }

  const newUser = {
    id: users.length + 1,
    name: fullname,
    email,
    phone,
    password,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const accessToken = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    path: '/',
  });

  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công!',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// GET /api/auth/me → lấy thông tin user hiện tại
router.get('/me', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    }
  });
});

// POST /api/auth/logout → logout
router.post('/logout', (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;

// ✅ EXPORT middleware
export { authenticateJWT };