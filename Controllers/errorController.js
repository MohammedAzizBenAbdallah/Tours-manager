const AppError = require("../utils/appError");

const handleDuplicateFieldsDB = (err) => {
  console.log("DuplicateFieldsDB handler is working!");
  console.log(err);
  const fieldName = Object.keys(err.keyValue)[0];
  const message = `Duplicate ${fieldName} value: ${err.keyValue[fieldName]}. Please use another value!`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  console.log("CastError handler is working!");
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");
  const message = `Invalid tour input data. ${errors}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError("invalid web token, please log in  again", 401);

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    // stack: error.stack,
    error: error
  });
};

const sendErrorProd = (error, res) => {
  console.log("💥Error ", error);
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong"
    });
  }
};

const handleJWTexpired = (err) =>
  new AppError("your token has expired please log in again", 401);

module.exports = (err, req, res, next) => {
  console.log("Environment:", process.env.ENV_TYPE);
  console.log("Original error:", err);
  console.log("Error name:", err.name);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.ENV_TYPE === "dev") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    console.log("errorrrrrrrrrrrr", error);
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError(error);
    if (err.name === "TokenExpiredError") error = handleJWTexpired(error);
    sendErrorProd(error, res);

    next();
  }
};
