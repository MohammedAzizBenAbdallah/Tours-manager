const AppError = require("../utils/appError");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");

const getTop5CheapTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  // Getting Data
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const Tours = await features.query;

  // Sending response

  res.status(200).json({
    status: "success",
    results: Tours.length,
    data: {
      tours: Tours
    }
  });
});

const getTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError("tour id not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
});

const createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({

  // })
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    msg: "New tour created successfully",
    data: {
      newTour
    }
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour) {
    return next(new AppError("tour id not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError("tour id not found", 404));
  }

  res.status(204).json({
    status: "success",
    msg: "Tour deleted successfully",
    data: null
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        data: { $push: "$$ROOT" }
      }
    }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats
    }
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates"
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numberOfTours: { $sum: 1 },
        tours: { $push: "$name" }
      }
    },
    {
      $addFields: {
        month: "$_id"
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        numberOfTours: 1,
        tours: 1
      }
    },
    {
      $sort: {
        numberOfTours: -1
      }
    }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan
    }
  });
});

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getTop5CheapTours,
  getTourStats,
  getMonthlyPlan
};
