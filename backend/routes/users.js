// backend/routes/users.js
import { Router } from 'express';
import { users } from '../data/users.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;