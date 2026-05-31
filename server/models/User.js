import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const { _id, email, name, createdAt, isAdmin } = this;
  return { id: _id, email, name, createdAt, isAdmin };
};

export default mongoose.model("User", userSchema);
