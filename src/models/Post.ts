import { isValidObjectId, Schema, model } from "mongoose";
import { z } from "zod";

// --- 1. ZOD VALIDATION (The "Security Guard") ---
// We use this to check the data coming FROM the frontend.
export const postInputSchema = z.strictObject({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  description: z
    .string()
    .min(10, "Please describe the item or where it is located")
    .max(1000),
  category: z.enum(["Furniture", "Electronics", "Clothing", "Books", "Other"]),
  location: z.string().min(1, "Location is required"), 
  images: z.array(z.string()).optional(), // URLs of the photos
  ownerId: z.string().refine((val) => isValidObjectId(val), "Invalid owner ID"),
});

// This is for when someone marks an item as "Taken" or "Pending"
export const postUpdateInputSchema = postInputSchema.partial().extend({
  status: z.enum(["available", "pending", "taken"]).optional(),
});


// --- 2. MONGOOSE SCHEMA (The "Vault") ---
// This is how the data lives in MongoDB.
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: ["Furniture", "Electronics", "Clothing", "Books", "Other"], 
      required: true 
    },
    location: { type: String, required: true },
    images: [{ type: String }],
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { 
      type: String, 
      enum: ["available", "pending", "taken"], 
      default: "available" 
    },
  },
  { timestamps: true } 
);

export const Post = model("Post", postSchema);