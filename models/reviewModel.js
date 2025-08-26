//review / rating/ createdAt/ ref to user/ ref to tour

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    review: {
      type: String,
      required: [true, "review must not be empty !"]
    },
    rating: {
      type: Number,
      max: [5, "rating is between 1 and 5"],
      min: [1, "rating is between 1 and 5"]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"]
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name photo" });
  next();
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
module.exports = Review;
