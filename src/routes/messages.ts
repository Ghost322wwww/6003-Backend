import express from 'express';
import {
  sendMessage,
  replyMessage,
  getMyMessages,
  deleteMessage,
  getAllMessages
} from '../controllers/messageController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/all', authenticate, getAllMessages);
router.get('/mine', authenticate, getMyMessages);
router.post('/', authenticate, sendMessage);
router.get('/', authenticate, getMyMessages);
router.post('/:id/reply', authenticate, replyMessage);
router.delete('/:id', authenticate, deleteMessage);

export default router;
