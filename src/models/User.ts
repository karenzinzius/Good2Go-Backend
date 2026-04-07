import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, maxLength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    postalCode: { type: String },
    profilePic: { type: String, default: "" },
    favourites: [{ type: Schema.Types.ObjectId, ref: "Post" }]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model("User", userSchema);