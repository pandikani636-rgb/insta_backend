import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: true, // Automatically reflect the request origin
    credentials: true,
  })
);

app.use(express.json());

// Connect MongoDB before handling API request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Auth routes
app.use("/api/auth", authRoutes);

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Instagram Backend API is running",
  });
});

// Health
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running...",
  });
});

export default app;