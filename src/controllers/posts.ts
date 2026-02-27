import type { RequestHandler } from "express";
import { Post } from "#models";

const getPosts: RequestHandler = async (req, res) => {
    try {
    const { category, location } = req.query;

    const query: any = {};

    if (category && category !== "All") {
      query.category = category;
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export default {getPosts,};
