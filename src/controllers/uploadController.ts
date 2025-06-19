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
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    if (user.avatar) {
      const oldPath = path.join(__dirname, '..', '..', user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath); 
      }
    }

    const newAvatarPath = `/uploads/${req.file.filename}`;
    user.avatar = newAvatarPath;
    await user.save();

    res.status(200).json({
      message: 'Avatar uploaded and updated successfully',
      avatar: newAvatarPath
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};
