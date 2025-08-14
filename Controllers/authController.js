const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { sendEmail } = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true
  };
  if (process.env.ENV_TYPE === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  createAndSendToken(newUser, 201, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password actually exists

  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  // 2) check if the password is correct
  const user = await User.findOne({
    email
  }).select("+password +active");
  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  if (!user.active) {
    return next(new AppError("this user has been deleted !", 404));
  }
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Step 1: Get token from Authorization header if it exists and starts with 'Bearer'

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Step 2: If no token found, return an error indicating the user is not logged in
  if (!token) {
    return next(
      new AppError("You are not logged in Please log in to get access ", 401)
    );
  }

  // Step 3: Verify the token using JWT and get the decoded payload
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Step 4: Check if the user still exists in the database
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("the user does not exist any longer", 401));
  }

  // Step 5: Check if the user changed their password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "user changed their password recently please log in again.",
        401
      )
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    console.log(
      "hellloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo ",
      req.user.role
    );
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have permission to perform this action", 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1 get user based on email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("email not found", 404));
  }
  //2 generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3  send it to the user email

  const resetUrl = `${req.protocol}://${req.get.host}/api/v1/users/resetPassword/${resetToken}`;
  const message = `forgot your password ? submit  a patch request with your new password and password confirm to to the  ${resetUrl}.\n if you didnt forget your password please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token ( valid for 10 mins)",
      msg: message
    });
    res.status(200).json({
      status: "success",
      message: "token sent via mail"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError("there was an error sending the email. Try again later", 500)
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on the token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  //2) if token has not expired , and there is a user, set new password

  if (!user) {
    return next(new AppError("token is invalid or has expired", 400));
  }

  // Validate password and passwordConfirm
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(
      new AppError("Please provide password and passwordConfirm", 400)
    );
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now() - 1000; // Set to 1 second ago to ensure JWT is still valid
  await user.save();

  //3) update changed password property in the user database document  Field
  //4) log the user in , send JWT
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) get User  from collection

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(
      new AppError(
        "user non existent how did you get to this point dawg xD",
        404
      )
    );
  }

  //2) check if posted password is correct
  const { currentPassword, newPassword, passwordConfirm } = req.body;
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("wrong password", 401));
  }
  //3) update the password
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  //4) log in user , send JWT
  createAndSendToken(user, 200, res);
});
