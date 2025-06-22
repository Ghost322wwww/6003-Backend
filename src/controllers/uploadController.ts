import { Request, Response } from 'express';
import User from '../models/User';

export const uploadHotelImage = (req: Request, res: Response) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    if (imageUrl) {
      res.status(200).json({ message: 'Hotel image uploaded successfully', imageUrl });
    } else {
      res.status(400).json({ message: 'Image upload failed' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error uploading hotel image', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred during image upload' });
    }
  }
};

export const uploadAvatar = async (req: any, res: Response) => {
  try {
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const userId = req.user.id; 

    if (avatarUrl) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: avatarUrl },
        { new: true }
      );
      res.status(200).json({ message: 'Avatar uploaded successfully', avatarUrl, user: updatedUser });
    } else {
      res.status(400).json({ message: 'Avatar upload failed' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error uploading avatar', error: error.message });
  }
};