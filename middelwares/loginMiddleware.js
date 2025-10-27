import { loginSchema } from "../validations/authValidation";

const loginMiddleware = (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof validator.z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default loginMiddleware;
