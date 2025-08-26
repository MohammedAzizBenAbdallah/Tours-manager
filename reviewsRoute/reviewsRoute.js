const express = require("express");

const reviewsController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authController.protect);
reviewRouter
  .route("/")
  .get(authController.protect, reviewsController.getReviews)
  .post(
    authController.protect,
    authController.restrictTo("user", "admin"),
    reviewsController.setToursAndUsersId,
    reviewsController.createReview
  );

reviewRouter
  .route("/:id")
  .get(reviewsController.getReview)
  .delete(reviewsController.deleteReview)
  .patch(reviewsController.updateReview);

module.exports = reviewRouter;
