import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, maxLength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Post" }]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model("User", userSchema);