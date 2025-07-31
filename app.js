// 1 - middlewares
const morgan = require("morgan");
// require("dotenv").config({ path: "./config.env" });
const express = require("express");
const { default: mongoose } = require("mongoose");

const tourRouter = require("./tourRoutes/tourRoute");
const userRouter = require("./userRoutes/userRoute");

const globalErroHandler = require("./Controllers/errorController");
const AppError = require("./utils/appErrors");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  next();
});
app.use(express.static(`${__dirname}/public`));

if (process.env.ENV_TYPE === "dev") {
  // eslint-disable-next-line no-console
  console.log("app is in development state");
  mongoose.set("debug", true);
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route Handlers

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(error);
});

app.use(globalErroHandler);

//app start

module.exports = app;
