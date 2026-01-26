// backend/routes/auth.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { users } from '../data/users.js';

const JWT_SECRET = 'PHARMAHUB_SECRET_KEY';

const router = Router();

// Middleware xác thực JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// POST /api/auth/login → đăng nhập
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  // Tìm user theo email
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
  }

  // Tạo token
  const accessToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role || 'user' 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    accessToken,
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

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email đã được sử dụng' }); 
  }

  // Create new user
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

  console.log('New user created:', newUser.id, newUser.email);
  console.log('Total users:', users.length);

  // Tạo token
  const accessToken = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công!',
    accessToken, 
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
  res.json({ success: true, message: 'Logged out successfully' });
});

// POST /api/auth/refresh → refresh token 
router.post('/refresh', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Tạo token mới
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      accessToken: newToken
    });
  });
});

export default router;

// Export middleware
export { authenticateJWT };