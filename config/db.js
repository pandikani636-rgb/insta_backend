import mongoose from "mongoose";

let cachedConnection = null;

export const connectDB = async () => {
  try {
    if (cachedConnection && mongoose.connection.readyState === 1) {
      return cachedConnection;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected Successfully");

    return cachedConnection;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};