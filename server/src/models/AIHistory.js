import mongoose from "mongoose";

const aiHistorySchema = new mongoose.Schema({
  userId: { type: String, default: null }, // can be null for anonymous sessions
  type: { type: String, required: true, enum: ["chat", "recommendation", "description"] },
  input: { type: String, required: true },
  output: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const AIHistory = mongoose.model("AIHistory", aiHistorySchema);
export default AIHistory;
