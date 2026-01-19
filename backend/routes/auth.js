// backend/routes/auth.js
import { Router } from 'express';
import { users } from '../data/users.js';

const router = Router();

// Helper: Tìm user theo token giả lập
function findUserByToken(token) {
  if (!token || !token.startsWith('fake-token-')) return null;
  const id = parseInt(token.replace('fake-token-', ''), 10);
  return users.find(u => u.id === id);
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
  }

  const token = `fake-token-${user.id}`;

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // chỉ true khi production + HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 tuần
    path: '/',
    sameSite: 'lax' // bảo vệ CSRF
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

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.cookies.access_token;
  const user = findUserByToken(token);

  if (!user) {
    return res.status(401).json({ authenticated: false });
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

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('access_token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ success: true });
});

export default router;