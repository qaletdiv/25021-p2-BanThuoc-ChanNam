// backend/routes/addresses.js
import { Router } from 'express';
import { addresses } from '../data/addresses.js';

const router = Router();

router.get('/', (req, res) => {
  const userId = req.query.userId;
  if (userId) {
    const userAddresses = addresses.filter(a => a.userId == userId);
    return res.json(userAddresses);
  }
  res.json(addresses);
});

export default router;