import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const toggleFavSchema = z.object({
  postId: z.string().refine((val) => isValidObjectId(val), "Invalid Post ID"),
});

export const userUpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  profilePic: z.string().url().optional().or(z.literal("")),
});