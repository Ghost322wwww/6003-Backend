import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  location: String,
  availableRooms: Number,
  pricePerNight: Number
});

export const Hotel = mongoose.model('Hotel', hotelSchema);
