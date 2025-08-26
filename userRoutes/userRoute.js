/* eslint-disable no-unused-expressions */
const express = require("express");
const factory = require("../Controllers/handlerFactory");
const {
  getAllUsers,
  createUser,
  updateMe,
  deleteMe,
  getUserById,
  updateUser,
  deleteUser
} = require("../Controllers/userController");

const authController = require("../Controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", authController.signUp);
userRouter.post("/login", authController.signIn);

userRouter.post("/forgotPassword", authController.forgotPassword);
userRouter.patch("/resetPassword/:token", authController.resetPassword);

userRouter.use(authController.protect);

userRouter.patch(
  "/updatePassword",

  authController.updatePassword
);
userRouter.patch("/updateMe", updateMe);
userRouter.delete("/deleteMe", deleteMe);

userRouter.use(authController.restrictTo("admin"));
userRouter.route("/").get(getAllUsers).post(createUser);

userRouter.route("/me").get(factory.getMe, getUserById);
userRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
