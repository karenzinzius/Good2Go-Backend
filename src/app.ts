import express from "express";
import "#db";
import {postRouter} from "#routers";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/posts", postRouter);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
