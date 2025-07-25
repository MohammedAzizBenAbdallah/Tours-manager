const express = require("express");

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
} = require("../Controllers/userController");
const tourRouter = express.Router();

tourRouter.route("/").get(getAllUsers).post(createUser);
tourRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
module.exports = tourRouter;
