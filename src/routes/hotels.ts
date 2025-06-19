import express from 'express';
import {
  getHotels,
  getHotelById,
  addHotel,
  updateHotel,
  deleteHotel
} from '../controllers/hotelController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/authorize';

const router = express.Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.post('/', authenticate, authorizeRole('operator'), addHotel);
router.put('/:id', authenticate, authorizeRole('operator'), updateHotel);
router.delete('/:id', authenticate, authorizeRole('operator'), deleteHotel);

export default router;
