import User from "../models/user.js";
import bcrypt from "bcryptjs";
import HttpError from "../utils/HttpError.js";
import { dbQuery } from "../middlewares/error.middleware.js";

export const registerController = dbQuery(async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new HttpError({ status: 400, message: "Email already registered" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashed,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: { id: user._id, username: user.username, email: user.email },
  });
});
