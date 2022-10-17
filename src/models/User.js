import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  password: String,
  socialOnly: Boolean,
  contents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Contents",
    },
  ],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

userSchema.pre("save", async function () {
  if (this.password !== null && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 3);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
