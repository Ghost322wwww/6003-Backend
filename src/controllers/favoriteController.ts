import { Request, Response } from 'express';
import { Favorite, IFavorite } from '../models/Favorite';
import mongoose from 'mongoose';

export const addFavorite = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { hotelId } = req.body;

    if (!mongoose.isValidObjectId(hotelId)) {
      res.status(400).json({ message: 'Invalid hotel ID' });
      return;
    }

    const exists = await Favorite.findOne({ user: userId, hotel: hotelId });
    if (exists) {
      res.status(400).json({ message: 'Hotel already in favorites' });
      return;
    }

    const favorite = new Favorite({ user: userId, hotel: hotelId });
    await favorite.save();

    res.status(201).json({ message: 'Hotel added to favorites', favorite });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};

export const getFavorites = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;

    const favorites = await Favorite.find({ user: userId }).populate('hotel');
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Failed to get favorites' });
  }
};

export const removeFavorite = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid favorite ID' });
      return;
    }

    const favorite = await Favorite.findById(id) as IFavorite;

    if (!favorite) {
      res.status(404).json({ message: 'Favorite not found' });
      return;
    }

    if (favorite.user.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this favorite' });
      return;
    }

    await Favorite.findByIdAndDelete(id);
    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};
