import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const messageInputSchema = z.object({
  receiverId: z.string().refine((val) => isValidObjectId(val), "Invalid Receiver ID"),
  postId: z.string().refine((val) => isValidObjectId(val), "Invalid Post ID"),
  text: z.string().min(1, "Message cannot be empty").max(500),
  senderId: z.string().refine((val) => isValidObjectId(val), "Invalid Sender ID"),
});

// For marking as read or small edits
export const messageUpdateSchema = z.object({
  text: z.string().min(1).optional(),
  read: z.boolean().optional(),
});