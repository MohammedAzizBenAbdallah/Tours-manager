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

const tourRouter = express.Router();

// tourRouter.param("id", checkId);

tourRouter.route("/top-5-cheapTours").get(getTop5CheapTours, getAllTours);
tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);
tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
