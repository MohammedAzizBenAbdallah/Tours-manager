const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const getTop5CheapTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getAllTours = factory.getAll(Tour);

const getTourById = factory.getOne(Tour, { path: "reviews" });

const createTour = factory.createOne(Tour);
// const createTour = catchAsync(async (req, res, next) => {
//   // const newTour = new Tour({

//   // })
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: "success",
//     msg: "New tour created successfully",
//     data: {
//       newTour
//     }
//   });
// });

// const updateTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;

//   const tour = await Tour.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!tour) {
//     return next(new AppError("tour id not found", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour
//     }
//   });
// });

const updateTour = factory.updateOne(Tour);

const deleteTour = factory.deleteOne(Tour);

// const deleteTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;

//   const tour = await Tour.findByIdAndDelete(id);

//   if (!tour) {
//     return next(new AppError("tour id not found", 404));
//   }

//   res.status(204).json({
//     status: "success",
//     msg: "Tour deleted successfully",
//     data: null
//   });
// });

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
