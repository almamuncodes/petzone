import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
