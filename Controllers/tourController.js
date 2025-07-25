const Tour = require("../models/tourModel");

const getAllTours = async (req, res) => {
  try {
    const Tours = await Tour.find();

    res.status(200).json({
      status: "success",
      results: Tours.length,
      data: {
        tours: Tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err
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

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
};
