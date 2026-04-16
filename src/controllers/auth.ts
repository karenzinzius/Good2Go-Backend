import type { RequestHandler } from 'express';
import { User, RefreshToken } from '#models';
import { createTokens, setAuthCookies } from '#utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { REFRESH_JWT_SECRET } from '#config';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ 
    $or: [{ email: email }, { username: username }] 
  });
    if (exists) throw new Error('User already exists', { cause: 409 });

    const user = await User.create({ username, email, password });
    const [refreshToken, accessToken] = await createTokens(user);
    setAuthCookies(res, refreshToken, accessToken);

    res.status(201).json({ 
      message: 'Registered',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        favourites: []
      }
    });
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

    res.json({ 
      message: 'Logged in', 
      user: { 
        _id: user._id, 
        username: user.username, 
        email: user.email,
        favourites: user.favourites 
      } 
    });
  } catch (err) { next(err); }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId; 
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

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error("No refresh token", { cause: 401 });

    // 1. Check if token exists in DB
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) throw new Error("Invalid refresh token", { cause: 403 });

    // 2. Verify JWT
    const decoded = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findById(decoded.sub);
    if (!user) throw new Error("User not found", { cause: 404 });

    // 3. Generate NEW tokens
    const [newRefreshToken, newAccessToken] = await createTokens(user);
    
    // 4. Update DB and Cookies
    await RefreshToken.deleteOne({ _id: tokenDoc._id });
    setAuthCookies(res, newRefreshToken, newAccessToken);

    res.json({ message: "Tokens refreshed" });
  } catch (err) {
    next(err);
  }
};