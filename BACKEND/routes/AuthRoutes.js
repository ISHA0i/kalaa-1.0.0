const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/me', verifyToken, getMe);
router.put('/updatedetails', verifyToken, updateDetails);
router.put('/updatepassword', verifyToken, updatePassword);

module.exports = router;