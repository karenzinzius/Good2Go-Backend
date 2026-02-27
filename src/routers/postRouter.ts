import { Router } from "express";
import {posts} from "#controllers";

const router = Router();

// GET /api/posts?category=Furniture&location=Berlin
router.get("/", posts.getPosts);

// 🔹 You can add other CRUD endpoints later
// router.post("/", postsController.createPost);
// router.put("/:id", postsController.updatePost);
// router.delete("/:id", postsController.deletePost);

export default router;