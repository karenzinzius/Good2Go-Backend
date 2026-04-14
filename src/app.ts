import "#db";
import cors from "cors";
import express from "express";
import cookieParser from 'cookie-parser';
import { postRouter, authRouter, userRouter, messageRouter } from "#routers";
import { errorHandler } from "#middlewares";
import { CLIENT_BASE_URL } from '#config';

const app = express();
const port = process.env.PORT || 3000;

// 1. CORS
app.use(cors({
  origin: CLIENT_BASE_URL,
  credentials: true   ,
  exposedHeaders: ['WWW-Authenticate']          
}));

// 2. Body & Cookie Parser
app.use(express.json(), cookieParser());
// It tells Express how to read the text fields inside a FormData request.
app.use(express.urlencoded({ extended: true }));

// 3. API Routes
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);      
app.use("/api/messages", messageRouter); 

// 4. The "Splat" (Catch-all for 404s)
app.all("*splat", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`, { cause: 404 });
  next(err); 
});

// 5. Global Error Handler (The Safety Net)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});