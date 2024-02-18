const express = require("express");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// error handling middleware
app.all("*", (req, res, next) => {
  globalErrorHandler(new AppError(`Cannot find ${req.originalUrl} on this server!!`, 404), req, res, next);
});

app.use(globalErrorHandler);

module.exports = app;
