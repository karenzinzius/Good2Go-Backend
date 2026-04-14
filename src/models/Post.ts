import { Schema, model, Types } from "mongoose";

// Interface for TypeScript to know what a Post looks like in the DB
interface IPost {
  title: string;
  description: string;
  ownerId: Types.ObjectId;
  category: "Furniture" | "Electronics" | "Clothing" | "Books" | "Household" | "Other";
  location: string;
  images?: string[];
  status: "available" | "pending" | "taken";
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 1000 },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { 
      type: String, 
      enum: ["Furniture", "Electronics", "Clothing", "Books", "Household",  "Other"],
      required: true 
    },
    location: { type: String, required: true },
    images: [{ type: String }],
    status: { 
      type: String, 
      enum: ["available", "pending", "taken"], 
      default: "available" 
    },
  },
  { timestamps: true }
);

export const Post = model<IPost>("Post", postSchema);