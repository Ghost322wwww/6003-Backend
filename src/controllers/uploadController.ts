import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { Hotel } from '../models/Hotel';
import { User } from '../models/User'; 

export const uploadHotelImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotelId = req.params.hotelId;
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    hotel.imageUrl = imageUrl;
    await hotel.save();

    res.status(200).json({
      message: 'Image uploaded and hotel updated',
      imageUrl,
      hotelId
    });
  } catch (err) {
    next(err);
  }
};

export const uploadAvatar = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: No user ID found in token' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      fs.unlinkSync(req.file.path); 
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.avatar) {
      const oldFileName = path.basename(user.avatar); 
      const oldPath = path.join(req.file.destination, oldFileName);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      avatarUrl: user.avatar,
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};