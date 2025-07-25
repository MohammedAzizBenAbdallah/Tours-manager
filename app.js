// 1 - middlewares
const morgan = require("morgan");
// require("dotenv").config({ path: "./config.env" });
const express = require("express");

const tourRouter = require("./tourRoutes/tourRoute");
const userRouter = require("./userRoutes/userRoute");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  next();
});
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Hello from the middleware👋");
  next();
});

if (process.env.ENV_TYPE === "dev") {
  console.log("app is in development state");
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route Handlers

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//app start

module.exports = app;
