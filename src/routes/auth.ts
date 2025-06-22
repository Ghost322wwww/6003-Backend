import express from 'express';
import { register, loginUser } from '../controllers/authController';
import { updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.put('/profile', authenticate, upload.single('avatar'), updateProfile);

export default router;
