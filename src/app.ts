import express from "express";
import cors from "cors";
import "#db";
import { postRouter, authRouter, userRouter, messageRouter } from "#routers";
import { errorHandler } from "#middlewares";

const app = express();
const port = process.env.PORT || 3000;

// 1. CORS
app.use(cors({
  origin: process.env.CLIENT_BASE_URL,
  credentials: true             
}));

// 2. Body Parser
app.use(express.json());

// 3. API Routes
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);      
app.use("/api/messages", messageRouter); 

// 4. The "Splat" (Catch-all for 404s)
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`, { cause: 404 });
  next(err); 
});

// 5. Global Error Handler (The Safety Net)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});