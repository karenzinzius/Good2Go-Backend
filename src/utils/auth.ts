import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from '#config';
import { RefreshToken, User } from '#models';
import type { Document } from 'mongoose';

export const createTokens = async (user: Document) => {
  // Create access token (short-lived)
  const accessToken = jwt.sign(
    { sub: user._id.toString() },
    ACCESS_JWT_SECRET,
    { expiresIn: '15m' }
  );

  // Create refresh token (long-lived)
  const refreshToken = jwt.sign(
    { sub: user._id.toString() },
    REFRESH_JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Store refresh token in DB
  await RefreshToken.create({ token: refreshToken, userId: user._id });

  return [refreshToken, accessToken] as const;
};

export const setAuthCookies = (res: Response, refreshToken: string, accessToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
};