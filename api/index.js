import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
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

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Instagram Backend API is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running...",
  });
});

export default app;