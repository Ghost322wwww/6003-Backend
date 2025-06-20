import express from 'express';
import {
  getHotels,
  addHotel,
  getHotelById,
  updateHotel,
  deleteHotel
} from '../controllers/hotelController';

import { authenticate } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/authorize';

const router = express.Router();

router.get('/', getHotels);
router.post('/', authenticate, authorizeRole('operator'), addHotel);
router.get('/:id', getHotelById);
router.put('/:id', authenticate, authorizeRole('operator'), updateHotel);
router.delete('/:id', authenticate, authorizeRole('operator'), deleteHotel);

export default router;
