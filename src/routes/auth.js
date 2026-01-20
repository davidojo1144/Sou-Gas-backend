const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  verifyCode,
  resetPassword,
  updateDetails,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgotpassword', forgotPassword);
router.post('/verifycode', verifyCode);
router.put('/resetpassword', resetPassword);

module.exports = router;
