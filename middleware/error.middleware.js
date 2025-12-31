const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // DEVELOPMENT
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // PRODUCTION
  res.status(err.statusCode).json({
    status: err.status,
    message: err.isOperational
      ? err.message
      : "Something went wrong"
  });
};

export default globalErrorHandler;
