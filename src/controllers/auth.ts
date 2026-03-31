import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { RequestHandler } from 'express';
import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET, SALT_ROUNDS } from '#config';
import { User, RefreshToken } from '#models';
import { createTokens, setAuthCookies } from '#utils';

// Register
export const register: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if email already exists
  const exists = await User.exists({ email });
  if (exists) return res.status(409).json({ message: 'Email already exists' });

  // Create user
  const user = await User.create({ username, email, password });

  // Generate tokens
  const [refreshToken, accessToken] = await createTokens(user);

  // Set cookies
  setAuthCookies(res, refreshToken, accessToken);

  res.status(201).json({ message: 'Registered' });
};

// Login
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  // Remove old refresh tokens
  await RefreshToken.deleteMany({ userId: user._id });

  const [refreshToken, accessToken] = await createTokens(user);

  setAuthCookies(res, refreshToken, accessToken);

  res.status(200).json({ message: 'Logged in' });
};

// Logout
export const logout: RequestHandler = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) await RefreshToken.deleteOne({ token: refreshToken });

  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  res.json({ message: 'Successfully logged out' });
};

// Me / Profile
export const me: RequestHandler = async (req, res) => {
  const { accessToken } = req.cookies;
  if (!accessToken) return res.status(401).json({ message: 'Access token required' });

  try {
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findById(decoded.sub).select('-password').populate('favourites').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Valid token', user });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};

  export const toggleFavourite: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.body.ownerId; // Provided by your authenticate middleware!

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favourites.indexOf(postId);
    if (index === -1) {
      user.favourites.push(postId); // Add to favs
    } else {
      user.favourites.splice(index, 1); // Remove from favs
    }

    await user.save();
    res.status(200).json(user.favourites);
  } catch (error) {
    res.status(500).json({ message: "Error toggling favourite" });
  }
};
