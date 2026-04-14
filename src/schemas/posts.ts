import { isValidObjectId, Types} from "mongoose";
import { z } from "zod";

const dbEntrySchema = z.strictObject({
  _id: z.instanceof(Types.ObjectId),
  createdAt: z.date(),
  updatedAt: z.date(),
  __v: z.int().nonnegative(),
});

export const CATEGORIES = ["Furniture", "Electronics", "Clothing", "Books", "Household", "Other"] as const;
// --- 1. ZOD VALIDATION (The "Security Guard") ---
// We use this to check the data coming FROM the frontend.
const postInputSchema = z.strictObject({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  description: z
    .string()
    .min(10, "Please describe the item or where it is located")
    .max(1000),
  category: z.enum(CATEGORIES),
  location: z.string().min(1, "Location is required"), 
  images: z.array(z.string()).optional(), // URLs of the photos
  ownerId: z.string().optional(),
});

// This is for when someone marks an item as "Taken" or "Pending"
const postUpdateInputSchema = postInputSchema.partial().extend({
  status: z.enum(["available", "pending", "taken"]).optional(),
});


// --- 2. MONGOOSE SCHEMA (The "Vault") ---
// This is how the data lives in MongoDB.
const postSchema = z.object({
  ...dbEntrySchema.shape,
  ...postInputSchema.shape,
  owner: z.instanceof(Types.ObjectId),
});

export { postInputSchema, postUpdateInputSchema, postSchema };
