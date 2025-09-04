import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const ChatSchema = new mongoose.Schema({
  participants: [{ type: ObjectId, ref: "User", required: true }],
  lastMessage: { type: ObjectId, ref: "Message" }
}, { timestamps: true });

ChatSchema.index({ participants: 1 });

export default mongoose.model("Chat", ChatSchema);
