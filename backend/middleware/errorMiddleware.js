/**
 * Global error handling middleware for Express
 *
 * This middleware provides centralized error handling for the entire application.
 * It ensures errors are consistently formatted and appropriate status codes are sent.
 * In production, it also hides stack traces to avoid leaking sensitive information.
 */

// Custom error class for operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle errors by environment
const errorHandler = (err, req, res, next) => {
  // Default error values
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  console.error("Error:", {
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
    path: req.originalUrl,
    method: req.method,
  });

  // Handle Sequelize validation errors
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    error.message = err.errors.map((e) => e.message).join(", ");
    error.statusCode = 400;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token. Please log in again";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Your token has expired. Please log in again";
    error.statusCode = 401;
  }

  // Handle file too large error
  if (err.code === "LIMIT_FILE_SIZE") {
    error.message = "File too large. Maximum size is 5MB";
    error.statusCode = 400;
  }

  // Response formatting
  res.status(error.statusCode).json({
    success: false,
    error: error.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

// Route not found handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
};
