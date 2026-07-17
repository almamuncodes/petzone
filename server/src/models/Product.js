import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  petType: { type: String, required: true, enum: ["dog", "cat", "bird", "fish", "other"] },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 5 },
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
