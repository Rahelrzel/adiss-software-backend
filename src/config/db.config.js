// config/db.js
import mongoose from "mongoose";
import { env } from "./env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // stop the app if DB fails to connect
  }
};

export default connectDB;
