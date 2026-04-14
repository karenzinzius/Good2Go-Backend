import type { RequestHandler } from "express";
import { Post } from "#models";
import type { z } from "zod";
import { v2 as cloudinary } from 'cloudinary';
import type {
  postInputSchema,
  postUpdateInputSchema,
  postSchema,
} from "#schemas";

type PostInputDTO = z.infer<typeof postInputSchema>;
type UpdatePostDTO = z.infer<typeof postUpdateInputSchema>;
type PostDTO = z.infer<typeof postSchema>;

// 1. Get All & mine
export const getAllPosts: RequestHandler<{}, PostDTO[]> = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts as unknown as PostDTO[]);
  } catch (err) {
    next(err);
  }
};

export const getMyPosts: RequestHandler = async (req, res, next) => {
  try {
    // 1. Get the userId that was attached by your 'authenticate' middleware
    const userId = (req as any).userId; 

    // 2. Find posts where ownerId matches this user
    // .sort({ createdAt: -1 }) puts the newest posts at the top
    const posts = await Post.find({ ownerId: userId }).sort({ createdAt: -1 });

    // 3. Send them back!
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// 2. Create
export const createPost: RequestHandler<{}, PostDTO, PostInputDTO> = async (req, res, next) => {
  console.log("BODY RECEIVED:", req.body); // Check if text is here
  console.log("FILES RECEIVED:", req.files); // Check if images are here
  try {
    const { title, description, location, category } = req.body;
    const files = req.files as Express.Multer.File[];
    const imageUrls = files?.map(file => file.path) || [];

    const newPost = await Post.create({
      title,
      description,
      location,
      category,
      images: imageUrls,
      ownerId: (req as any).userId 
    });

    res.status(201).json(newPost as unknown as PostDTO);
  } catch (err) {
    next(err);
  }
};

// 3. Get By ID
export const getPostById: RequestHandler<{ id: string }, PostDTO> = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new Error("Post not found!", { cause: 404 });
    res.json(post as unknown as PostDTO);
  } catch (err) {
    next(err);
  }
};

export const updatePost: RequestHandler<{ id: string }, PostDTO, UpdatePostDTO> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req; 

    const post = await Post.findById(id);
    if (!post) throw new Error("Post not found!", { cause: 404 });

    if (userId !== post.ownerId.toString()) {
      throw new Error("Unauthorized", { cause: 403 });
    }

    // 1. Handle new images from Multer
    const files = req.files as Express.Multer.File[];
    const newImageUrls = files?.map(file => file.path) || [];

    // 2. Merge updates and new images
    const updates = { ...req.body };
    if (newImageUrls.length > 0) {
      updates.images = [...(post.images || []), ...newImageUrls];
    }

    Object.assign(post, updates);
    await post.save();

    res.json(post as unknown as PostDTO);
  } catch (err) {
    next(err);
  }
};

export const deletePost: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const post = await Post.findById(id);
    if (!post) throw new Error("Post not found!", { cause: 404 });

    if (userId !== post.ownerId.toString()) {
      throw new Error("Unauthorized", { cause: 403 });
    }

    // --- NEW CLOUDINARY DELETE LOGIC ---
    if (post.images && post.images.length > 0) {
      const deletePromises = post.images.map((url) => {
        // Extract the public_id from the URL
        const parts = url.split('/');

        const fileNameWithExtension = parts[parts.length - 1]!;
        const fileName = fileNameWithExtension.split('.')[0]!;
        const folder = parts[parts.length - 2];
        const publicId = `${folder}/${fileName}`;
        
        return cloudinary.uploader.destroy(publicId);
      });
      
      await Promise.all(deletePromises);
    }
    // ------------------------------------

    await post.deleteOne();
    res.json({ message: "Post and images deleted!" });
  } catch (err) {
    next(err);
  }
};