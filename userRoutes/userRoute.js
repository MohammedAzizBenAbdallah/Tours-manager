/* eslint-disable no-unused-expressions */
const express = require("express");

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
} = require("../Controllers/userController");

const authController = require("../Controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", authController.signUp);
userRouter.post("/login", authController.signIn);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.post("/forgotPassword", authController.forgotPassword);
userRouter.patch("/resetPassword/:token", authController.resetPassword);
userRouter.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
userRouter.patch("/updateMe", authController.protect, updateMe);
userRouter.delete("/deleteMe", authController.protect, deleteMe);
// userRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
module.exports = userRouter;
