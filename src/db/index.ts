import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.MONGO_URI!, { dbName: "good2go" });
  console.log("MongoDB successfully connected!");
} catch (error) {
  console.error("MongoDB connection error:", error);
  process.exit(1);
}
