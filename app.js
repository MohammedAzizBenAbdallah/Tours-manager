// 1 - middlewares
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config({ path: "./config.env" });
const express = require("express");

const tourRouter = require("./tourRoutes/tourRoute");
const userRouter = require("./userRoutes/userRoute");
const reviewRouter = require("./reviewsRoute/reviewsRoute");

const globalErroHandler = require("./Controllers/errorController");
const AppError = require("./utils/appError");
const viewsRouter = require("./viewRoutes/viewRouter");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"), "./views");
app.use(express.static(path.join(__dirname, "public")));

// limit body size to onbly 10 kb

app.use(express.json({ limit: "10kb" }));

app.use(helmet());

app.use(xss());

app.use(mongoSanitize());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many requests from this ip please try again in an hour !"
});

//prevent query pollution

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price"
    ]
  })
);

if (process.env.ENV_TYPE === "dev") {
  // eslint-disable-next-line no-console
  console.log("app is in development state");
  // mongoose.set("debug", true);
  app.use(morgan("dev"));
}

// Route Handlers
app.use("/", viewsRouter);
app.use("/api", limiter);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

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
