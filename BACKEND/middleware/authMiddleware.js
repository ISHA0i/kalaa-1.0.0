// filepath: d:\git clone\kalaa-1.0.0\BACKEND\middleware\authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your_jwt_secret' with your actual secret key
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};