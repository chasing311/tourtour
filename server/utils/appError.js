class AppError extends Error {
  constructor(message, statusCode) {
    // calls the parent Error class constructor, setting the error message property
    super(message);
    this.statusCode = statusCode;
    // 4xx status codes are considered client failures
    // other status codes are treated as server errors.
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // operational errors (such as invalid requests from clients)
    // programming errors (such as unhandled exceptions or bugs).
    this.isOperational = true;

    // captures the stack trace for the AppError instance
    Error.captureStackTrace(this, this.constructor);
  }
}

// exports the AppError class, making it available for use in other modules.
module.exports = AppError;
