import type { RequestHandler } from "express";
import { Post, postInputSchema, postUpdateInputSchema } from "#models";
import { v2 as cloudinary } from "cloudinary";

// READ: Get all posts (with filters)
const getPosts: RequestHandler = async (req, res) => {
  try {
    const { category, location, search } = req.query;
    const query: any = { status: "available" };

    if (category && category !== "All") query.category = category;
    if (location) query.location = { $regex: location, $options: "i" };
    if (search) { query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// CREATE: Add a new item
const createPost: RequestHandler = async (req, res) => {
  try {
    // 1. Validate the input (The Guard)
    const validatedData = postInputSchema.parse(req.body);

    // 2. Upload images to Cloudinary (Converting strings to URLs)
    let imageUrls: string[] = [];
    if (validatedData.images && validatedData.images.length > 0) {
      const uploadPromises = validatedData.images.map((img) =>
        cloudinary.uploader.upload(img, { folder: "good-to-go" })
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((r) => r.secure_url);
    }

    // 3. Save to DB
    const newPost = await Post.create({
      ...validatedData,
      images: imageUrls,
    });

    res.status(201).json(newPost);
  } catch (error: any) {
    if (error.name === "ZodError") return res.status(400).json({ errors: error.errors });
    res.status(500).json({ message: "Failed to create post" });
  }
};

// UPDATE: Edit a post or change status (available -> taken)
const updatePost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Validate the data first
    const validatedData = postUpdateInputSchema.parse(req.body);

    // 2. Find and Update ONLY if the owner matches (Security!)
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, ownerId: req.body.ownerId }, 
      validatedData,
      { new: true }
    );

   if (!updatedPost) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    res.status(200).json(updatedPost);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Update failed" });
  }
};
// DELETE: Remove a post
const deletePost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export { getPosts, createPost, updatePost, deletePost };