import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../utils/HttpError.js";
import { dbQuery } from "../middlewares/error.middleware.js";
import { env } from "../config/env.config.js";

const loginController = dbQuery(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    throw new HttpError({ status: 400, message: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    throw new HttpError({ status: 400, message: "Invalid email or password" });

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
});

export default loginController;
