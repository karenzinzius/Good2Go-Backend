import type { RequestHandler } from 'express';
import { User, RefreshToken } from '#models';
import { createTokens, setAuthCookies } from '#utils';
import bcrypt from 'bcrypt';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.exists({ email });
    if (exists) throw new Error('Email already exists', { cause: 409 });

    const user = await User.create({ username, email, password });
    const [refreshToken, accessToken] = await createTokens(user);
    setAuthCookies(res, refreshToken, accessToken);

    res.status(201).json({ message: 'Registered' });
  } catch (err) { next(err); }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials', { cause: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials', { cause: 401 });

    await RefreshToken.deleteMany({ userId: user._id });
    const [refreshToken, accessToken] = await createTokens(user);
    setAuthCookies(res, refreshToken, accessToken);

    res.status(200).json({ message: 'Logged in', user: { username: user.username, email: user.email } });
  } catch (err) { next(err); }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId; // Provided by your authenticate middleware
    const user = await User.findById(userId).select('-password').populate('favourites').lean();
    if (!user) throw new Error('User not found', { cause: 404 });

    res.json({ user });
  } catch (err) { next(err); }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    // 1. If there is a refresh token, delete it from the DB
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Successfully logged out" });
  } catch (err) {
    next(err);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) { next(err); }
};