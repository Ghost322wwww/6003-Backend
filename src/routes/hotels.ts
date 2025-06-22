import express from 'express';
import { getHotels, addHotel, getHotelById, updateHotel, deleteHotel } from '../controllers/hotelController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { authorizeRole } from '../middleware/authorize';

const router = express.Router();

router.get('/', getHotels);
router.post('/', authenticate, authorizeRole('operator'), upload.single('image'), addHotel); 
router.get('/:id', getHotelById);
router.put('/:id', authenticate, authorizeRole('operator'), upload.single('image'), updateHotel);
router.delete('/:id', authenticate, authorizeRole('operator'), deleteHotel);

export default router;
