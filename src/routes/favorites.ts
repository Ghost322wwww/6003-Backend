import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticate, addFavorite);
router.get('/', authenticate, getFavorites);
router.delete('/:id', authenticate, removeFavorite);

export default router;
