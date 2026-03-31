import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "#controllers";
import { authenticate } from '#middlewares'

const postRouter = Router();

// GET /api/posts?category=Furniture&location=Berlin
postRouter.get("/", getPosts);
postRouter.post("/", authenticate, createPost);
postRouter.put("/:id", authenticate, updatePost);
postRouter.delete("/:id", authenticate, deletePost);

export default postRouter;