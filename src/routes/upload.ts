import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadHotelImage, uploadAvatar } from '../controllers/uploadController';
import { authenticate } from '../middleware/authMiddleware';
import { addHotel } from '../controllers/hotelController';

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);  
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;  
    cb(null, uniqueName);  
  }
});


const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

router.post('/:hotelId', authenticate, upload.single('image'), uploadHotelImage);

router.post('/hotels', authenticate, upload.single('image'), addHotel);

export default router;
