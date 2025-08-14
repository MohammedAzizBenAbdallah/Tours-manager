const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const getAllUsers = catchAsync(async (req, res) => {
  const Users = await User.find();

  res.status(200).json({
    status: "success",
    Users: Users.length,
    data: { Users }
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",

    message: "This route is not yet defined"
  });
};

const getUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined"
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined"
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined"
  });
};

const updateMe = catchAsync(async (req, res, next) => {
  //1 create an error if the user tries to update the password
  console.log(req.user);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "Can not update your password from this route  this route should not contain password fields inside the body  ",
        400
      )
    );
  }

  //2 update the user document
  const filteredObj = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success"
  });
});

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
};
