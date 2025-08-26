const express = require("express");

const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getTop5CheapTours,
  getTourStats,
  getMonthlyPlan
} = require("../Controllers/tourController");
const { protect, restrictTo } = require("../Controllers/authController");

const reviewsRouter = require("../reviewsRoute/reviewsRoute");

const tourRouter = express.Router();

// tourRouter.param("id", checkId);

tourRouter.route("/top-5-cheapTours").get(getTop5CheapTours, getAllTours);
tourRouter.route("/tour-stats").get(getTourStats);
tourRouter
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lad-guide", "guide"), getMonthlyPlan);
tourRouter
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
tourRouter
  .route("/:id")
  .get(getTourById)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

tourRouter.use("/:tourId/reviews", reviewsRouter);

// tourRouter
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("admin", "user"), reviewsController.createReview);
module.exports = tourRouter;
