import type { RequestHandler } from 'express';
import { Message } from '#models';

// 1. Send Message
const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { receiverId, postId, text } = req.body;
    const senderId = req.body.ownerId; // From authenticate middleware

    const newMessage = await Message.create({ senderId, receiverId, postId, text });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

// 2. Get My Inbox
const getMessages: RequestHandler = async (req, res) => {
  try {
    const userId = req.body.ownerId;
    
    // Find all messages where I am sender OR receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate('senderId', 'username') // Get sender's name
    .populate('postId', 'title')      // Get post title
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

const markAsRead: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.body.ownerId;

    await Message.updateMany(
      { postId, receiverId: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update read status" });
  }
};

export { sendMessage, getMessages, markAsRead };