import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: "../.env" }); // Read from root .env

// Import Middlewares
import { deserializeUser, requireAuth, requireAdmin } from "./middlewares/auth.js";

// Import Controllers
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview
} from "./controllers/productController.js";

import {
  generateDescription,
  recommendProduct,
  chatAssistant
} from "./controllers/aiController.js";

import { getDashboardStats } from "./controllers/dashboardController.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petzone";

// CORS Setup: Allow credentials and Next.js frontend port 3000
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

app.use(express.json());
app.use(deserializeUser); // Apply user deserialization to all routes

// Test Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PetZone AI API is running successfully." });
});

// Product Routes
app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductById);
app.post("/api/products", requireAuth, requireAdmin, createProduct);
app.put("/api/products/:id", requireAuth, requireAdmin, updateProduct);
app.delete("/api/products/:id", requireAuth, requireAdmin, deleteProduct);
app.post("/api/products/:id/reviews", addProductReview); // allow review for testing easily

// AI Routes
app.post("/api/ai/generate-description", generateDescription); // can be open/protected
app.post("/api/ai/recommend", recommendProduct);
app.post("/api/ai/chat", chatAssistant);

// Dashboard Routes
app.get("/api/dashboard/stats", getDashboardStats); // can be protected in production

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Express global error handler:", err);
  res.status(500).json({ error: "সার্ভার ইন্টারনাল এরর! দয়া করে আবার চেষ্টা করুন।" });
});

// Database Connection & Server Startup
console.log("Connecting to MongoDB at:", MONGODB_URI);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB.");
    app.listen(PORT, () => {
      console.log(`🚀 Express server running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("Starting server in standalone/mock DB mode...");
    // Start server anyway for graceful fallback
    app.listen(PORT, () => {
      console.log(`🚀 Express server running (Standalone/Mock Mode) on: http://localhost:${PORT}`);
    });
  });
