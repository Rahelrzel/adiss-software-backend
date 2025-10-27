import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import testRoute from "./routes/test.js";
import registerRoute from "./routes/register.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", testRoute);
app.use("/register", registerRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`)
);
