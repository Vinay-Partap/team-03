const logger = require("./logger");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;

  // Log server errors
  if (err.statusCode >= 500) {
    logger.error("Server Error: %O", err);
  }

  // Mongoose CastError
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new AppError(message, 400);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : "value";
    const message = `Duplicate field value: ${value}. Please use another value!`;
    error = new AppError(message, 400);
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    error = new AppError(message, 400);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again!", 401);
  }
  if (err.name === "TokenExpiredError") {
    error = new AppError("Your token has expired! Please log in again.", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

module.exports = {
  AppError,
  errorHandler,
};
