import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 255 },

    description: { type: String, required: true, maxLength: 1000 },

    location: { type: String, required: true },

    category: { type: String, required: true },

    images: { type: [String], default: [],},

    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("Post", postSchema);