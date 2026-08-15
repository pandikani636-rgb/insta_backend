import mongoose from "mongoose";

let cachedConnection = null;

export const connectDB = async () => {
  try {
    if (cachedConnection && mongoose.connection.readyState === 1) {
      return cachedConnection;
    }
    const defaultUri = "mongodb+srv://pandikani636_db_user:877887spkpandikani2101@cluster0.chwzj4f.mongodb.net/instaclone?retryWrites=true&w=majority&appName=Cluster0";
    
    let uri = process.env.MONGO_URI;
    if (!uri || uri.includes("cluster.mongodb.net") || uri.includes("cluster0.mongodb.net")) {
      uri = defaultUri;
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    cachedConnection = conn;
    return cachedConnection;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};