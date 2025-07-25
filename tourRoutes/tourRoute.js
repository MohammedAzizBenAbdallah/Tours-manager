const express = require("express");

const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
} = require("../Controllers/tourController");

const tourRouter = express.Router();

// tourRouter.param("id", checkId);
tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
