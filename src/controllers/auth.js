const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const sendSms = require('../utils/sendSms');

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, role, phoneNumber } = req.body;

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      phoneNumber,
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc      Get current logged in user
// @route     GET /api/auth/me
// @access    Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Forgot password
// @route     POST /api/auth/forgotpassword
// @access    Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Generate Verification Code (4 digits)
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Set code and expiration on user (10 mins)
    user.verificationCode = verificationCode;
    user.verificationCodeExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create message
    const message = `Your password reset code is: ${verificationCode}`;

    // Send SMS if phone number exists
    if (user.phoneNumber) {
      try {
        await sendSms(user.phoneNumber, message);
      } catch (err) {
        console.log('SMS sending failed:', err.message);
        // Continue to send email as fallback or primary
      }
    }

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Code',
        message,
      });

      res.status(200).json({
        success: true,
        data: 'Code sent',
      });
    } catch (err) {
      console.log(err);
      user.verificationCode = undefined;
      user.verificationCodeExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc      Verify Reset Code
// @route     POST /api/auth/verifycode
// @access    Public
exports.verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid code or code has expired', 400));
    }

    res.status(200).json({
      success: true,
      data: 'Code verified',
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Reset password
// @route     PUT /api/auth/resetpassword
// @access    Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid code or code has expired', 400));
    }

    // Set new password
    user.password = password;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc      Update user details
// @route     PUT /api/auth/updatedetails
// @access    Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      fullName: req.body.fullName,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
};
