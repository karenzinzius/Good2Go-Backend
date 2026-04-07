import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export const Message = model('Message', messageSchema);