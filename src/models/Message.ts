import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  user: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  message: string;
  reply?: string;
}

const messageSchema = new Schema<IMessage>(
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
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>('Message', messageSchema);
