import { Request, Response } from 'express';
import { Hotel } from '../models/Hotel';
import mongoose from 'mongoose';


export const getHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, minPrice, maxPrice } = req.query;
    const filter: any = {};
    if (location) {
      filter.location = { $regex: location, $options: 'i' }; 
    }
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.pricePerNight.$lte = parseFloat(maxPrice as string);
    }
    const hotels = await Hotel.find(filter);
    res.status(200).json(hotels);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Failed to retrieve hotels', error: err.message });
  }
};

export const addHotel = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const hotel = new Hotel({
      ...req.body,
      user: userId,
      imageUrl,
    });
    const savedHotel = await hotel.save();
    res.status(201).json(savedHotel);
  } catch (error) {
    const err = error as Error;
    console.error('Create hotel error:', err.message);
    res.status(500).json({ error: 'Failed to create hotel', message: err.message });
  }
};

export const getHotelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid hotel ID format' });
      return;
    }
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }
    res.status(200).json(hotel);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching hotel:', err.message);
    res.status(500).json({ message: 'Failed to fetch hotel', error: err.message });
  }
};

export const updateHotel = async (req: any, res: Response): Promise<void> => {
  try {
    const hotelId = req.params.id;
    const updateData: any = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updateData, { new: true });

    if (!updatedHotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    res.status(200).json(updatedHotel);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update hotel', error: err.message });
  }
};


export const deleteHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }
    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Failed to delete hotel', error: err.message });
  }
};
