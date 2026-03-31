import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "#config";

  const authenticate: RequestHandler = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as any;
    // We attach the user ID to the request so the controller can use it
    req.body.ownerId = decoded.sub; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid session" });
  }
};

export default authenticate;