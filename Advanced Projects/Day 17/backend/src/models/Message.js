import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = new mongoose.Schema({
  chat: { type: ObjectId, ref: "Chat", required: true, index: true },
  from: { type: ObjectId, ref: "User", required: true },
  to: { type: ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  deliveredTo: [{ type: ObjectId, ref: "User" }],
  readBy: [{ type: ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("Message", MessageSchema);
