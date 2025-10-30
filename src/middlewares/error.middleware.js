/* eslint-disable no-unused-vars */
import HttpError from "../utils/HttpError.js";

export const errorMiddleware = (error, req, res, _next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      message: error.message,
      ...error.options,
    });
  }

  console.error("Unexpected Error:", error);
  return res
    .status(500)
    .json({ message: error.message ?? "Oops, something went wrong!" });
};

// Wrapper to simplify async controllers
export const dbQuery = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
