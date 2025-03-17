const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/UserModel');

const router = express.Router();

// Protected route to get user details
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Fetch user details using the user ID from the token
    const user = await User.findById(req.user.id).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;