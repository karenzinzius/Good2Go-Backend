import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || '';
export const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET || 'access-secret';
export const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET || 'refresh-secret';
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;