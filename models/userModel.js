const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    minLength: [3, "name must be at least 5 characters long"],
    maxLength: [20, "name cannot exceed 20 characters long "],
    validate: {
      validator: function (value) {
        return validator.isAlpha(value.replace(/\s/g, ""));
      },
      message: "Name must contain only alphabetical characters and spaces"
    }
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "provided email is invalid"
    }
  },
  role: {
    type: String,
    enum: ["admin", "user", "guide", "lead-guide"],
    default: "user"
  },
  photo: {
    type: String,
    default: "default.png",
    validate: {
      validator: function (value) {
        return (
          value.toLowerCase().endsWith(".png") ||
          value.toLowerCase().endsWith(".jpg") ||
          value.toLowerCase().endsWith(".jpeg") ||
          value.toLowerCase().endsWith(".gif") ||
          value.toLowerCase().endsWith(".webp")
        );
      },
      message: "Photo must be a valid image file (png, jpg, jpeg, gif, webp)"
    }
  },
  password: {
    type: String,
    minLength: [8, "password length must be > 8 "],
    required: [true, "provide a password"],
    select: false
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, "confirm your password"],
    minLength: [8, "password must be at least 8 characters"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!"
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.methods.correctPassword = function (inputPassword, actualPassword) {
  return bcryptjs.compare(inputPassword, actualPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  console.log(resetToken, this.passwordResetToken);

  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.models.user || mongoose.model("User", userSchema);

module.exports = User;
