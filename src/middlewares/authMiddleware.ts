import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "#config";

  const authenticate: RequestHandler = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as any;
   
    (req as any).userId = decoded.sub; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid session" });
  }
};

export default authenticate;