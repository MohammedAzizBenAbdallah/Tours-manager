const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/APIFeatures");

const getTop5CheapTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      msg: error
    });
  }
};

const getTourById = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err
    });
  }
};

const createTour = async (req, res) => {
  // const newTour = new Tour({

  // })
  const newTour = await Tour.create(req.body);
  try {
    res.status(201).json({
      status: "success",
      msg: "New tour created successfully",
      data: {
        newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: "Invalid data sent "
    });
  }
};

const updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err
    });
  }
};

const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: "success",
      msg: "Tour deleted successfully",
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err
    });
  }
};

const getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err
    });
  }
};

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
