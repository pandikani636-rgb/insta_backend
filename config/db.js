import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  try {
    if (isConnected) {
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    isConnected = conn.connection.readyState === 1;

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};