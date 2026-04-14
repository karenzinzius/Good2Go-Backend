import { Router } from "express";
import { getAllPosts, getMyPosts, getPostById, createPost, updatePost, deletePost } from "#controllers";
import { validateBody, authenticate  } from '#middlewares'
import { postUpdateInputSchema } from '#schemas'
import { upload } from '#config'; 

const postRouter = Router();

postRouter.get("/mine", authenticate, getMyPosts);

// Public routes 
postRouter.get("/", getAllPosts); 
postRouter.get("/:id", getPostById);

// Protected routes 
postRouter.post("/", authenticate, upload.array('images', 10), createPost);
postRouter.patch("/:id", authenticate, validateBody(postUpdateInputSchema), updatePost); 
postRouter.delete("/:id", authenticate, deletePost); 

export default postRouter;