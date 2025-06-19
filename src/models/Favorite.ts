import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
  },
  { timestamps: true }
);

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);
