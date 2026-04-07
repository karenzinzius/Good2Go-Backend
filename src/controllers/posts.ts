import type { RequestHandler } from "express";
import { Post } from "#models";
import type { z } from "zod";
import type {
  postInputSchema,
  postUpdateInputSchema,
  postSchema,
} from "#schemas";

type PostInputDTO = z.infer<typeof postInputSchema>;
type UpdatePostDTO = z.infer<typeof postUpdateInputSchema>;
type PostDTO = z.infer<typeof postSchema>;

// 1. Get All
export const getAllPosts: RequestHandler<{}, PostDTO[]> = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts as unknown as PostDTO[]);
  } catch (err) {
    next(err);
  }
};

// 2. Create
export const createPost: RequestHandler<{}, PostDTO, PostInputDTO> = async (req, res, next) => {
  try {
    // req.body is already validated by validateBody(postInputSchema)
    const newPost = await Post.create(req.body);
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

    // Authorization Check
    if (userId !== post.ownerId.toString()) {
      throw new Error("You are not authorized to update this post", { cause: 403 });
    }

    // Apply updates from validated body
    Object.assign(post, req.body);
    await post.save();

    res.json(post as unknown as PostDTO);
  } catch (err) {
    next(err);
  }
};

export const deletePost: RequestHandler<{ id: string }, { message: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const post = await Post.findById(id);
    if (!post) throw new Error("Post not found!", { cause: 404 });

    if (userId !== post.ownerId.toString()) {
      throw new Error("Unauthorized delete attempt", { cause: 403 });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted!" });
  } catch (err) {
    next(err);
  }
};