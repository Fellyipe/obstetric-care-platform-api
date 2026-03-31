import { ValidationError, NotFoundError } from "../utils/errors.js";

export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: "Validation failed",
      message: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: "Not found",
      message: err.message,
    });
  }

  if (err.code) {
    return res.status(422).json({
      error: "Database error",
      message: err.message,
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
