import { Router } from "express";
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "#controllers";
import { validateBody, authenticate  } from '#middlewares'
import { postInputSchema, postUpdateInputSchema } from '#schemas'

const postRouter = Router();

// Public routes 
postRouter.get("/", getAllPosts); 
postRouter.get("/:id", getPostById);

// Protected routes 
postRouter.post("/", authenticate, validateBody(postInputSchema), createPost);
postRouter.patch("/:id", authenticate, validateBody(postUpdateInputSchema), updatePost); 
postRouter.delete("/:id", authenticate, deletePost); 

export default postRouter;