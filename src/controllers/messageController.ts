import { Request, Response } from 'express';
import { Message } from '../models/Message';
import mongoose from 'mongoose';

export const sendMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const { hotelId, message } = req.body;
    const userId = req.user.userId;

    if (!mongoose.isValidObjectId(hotelId)) {
      res.status(400).json({ message: 'Invalid hotel ID' });
      return;
    }

    const newMessage = new Message({
      user: userId,
      hotel: hotelId,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

export const replyMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (req.user.role !== 'operator') {
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

    res.status(200).json({ message: 'Reply saved', data: msg });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reply to message' });
  }
};

export const getMyMessages = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    let messages;

    if (role === 'operator') {
      messages = await Message.find().populate('user hotel');
    } else {
      messages = await Message.find({ user: userId }).populate('hotel');
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

export const deleteMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const role = req.user.role;

    const msg = await Message.findById(id);
    if (!msg) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (role !== 'operator' && msg.user.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this message' });
      return;
    }

    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message' });
  }
};
