import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { Hotel } from '../models/Hotel';

export const sendMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { hotelId, message } = req.body;

    if (!hotelId || !message) {
      res.status(400).json({ message: 'Missing required fields (hotelId or message)' });
      return;
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    const newMessage = new Message({
      user: userId,
      hotel: hotelId,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};


export const replyMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (req.user?.role !== 'operator') {
      res.status(403).json({ message: 'Only operators can reply to messages' });
      return;
    }

    const msg = await Message.findById(id);
    if (!msg) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    msg.reply = reply;
    await msg.save();

    res.status(200).json({ message: 'Reply saved successfully', data: msg });
  } catch (error) {
    console.error('❌ Error replying to message:', error);
    res.status(500).json({ message: 'Failed to reply to message' });
  }
};

export const getMyMessages = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const messages = await Message.find({ user: userId }).populate('hotel', 'name location');
    res.status(200).json(messages);
  } catch (error) {
    console.error('❌ Error retrieving messages:', error);
    res.status(500).json({ message: 'Failed to retrieve messages' });
  }
};

export const deleteMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const msg = await Message.findById(id);
    if (!msg) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (role !== 'operator' && msg.user.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this message' });
      return;
    }

    await msg.deleteOne();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};
