import type { RequestHandler } from 'express';
import { Message } from '#models';

// 1. Send Message
const sendMessage: RequestHandler = async (req, res, next) => {
 try {
    const senderId = req.userId; // Force sender to be the logged-in user
    const { receiverId, postId, text } = req.body;

    const newMessage = await Message.create({
      senderId,
      receiverId,
      postId,
      text
    });

    res.status(201).json(newMessage);
  } catch (err) { next(err); }
};

// 2. Get My Inbox
const getMessages: RequestHandler = async (req, res, next) => {
try {
    const userId = req.userId; 
    
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate('senderId receiverId', 'username profilePic')
    .populate('postId', 'title images') // Added back!
    .sort({ createdAt: 1 }); // Oldest first (chat style)

    res.json(messages);
  } catch (err) { next(err); }
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

const deleteMessage: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const found = await Message.findByIdAndDelete(id);
    if (!found) throw new Error("Message not found", { cause: 404 });
    res.json({ message: "Deleted!" });
  } catch (err) {
    next(err);
  }
};

export { sendMessage, getMessages, markAsRead, deleteMessage };