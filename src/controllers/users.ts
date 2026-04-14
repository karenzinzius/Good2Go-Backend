import type { RequestHandler } from "express";
import { User } from "#models";

// Get specific user profile (for the public view)
const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("username profilePic address");
    if (!user) throw new Error("User not found", { cause: 404 });
    res.json(user);
  } catch (err) { next(err); }
};

const updateProfilePic: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) throw new Error("Please upload an image", { cause: 400 });

    const userId = (req as any).userId;
    const imageUrl = req.file.path; // Cloudinary URL

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile picture updated!", user });
  } catch (err) { next(err); }
};

// Toggle a post in user's favourites list
const toggleFavourite: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const userId = req.userId; // From authenticate middleware

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found", { cause: 404 });

    const index = user.favourites.indexOf(postId);
    if (index === -1) {
      user.favourites.push(postId);
    } else {
      user.favourites.splice(index, 1);
    }

    await user.save();
    res.status(200).json(user.favourites);
  } catch (err) { next(err); }
};

export { getUserProfile, toggleFavourite, updateProfilePic }