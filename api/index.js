import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173", // Vite default
  "http://localhost:5173", // Always allow localhost for dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// MongoDB
connectDB();

// Auth routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Instagram Backend API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running...",
  });
});

export default app;