import mongoose from "mongoose";

const contentsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  paragraph: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  meta: {
    views: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

const Contents = mongoose.model("Contents", contentsSchema);
export default Contents;
