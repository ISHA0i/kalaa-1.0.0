const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var JWT_SECRET = "iNotebookisawesome";
var fetchuser = require("../middleware/fetchuser");

// Route 1: Create a new user using: POST "/api/auth/". Doesn't require Auth
router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      console.log("Request body:", req.body);

      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        console.log("User already exists:", user);
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      // Create a new user
      user = new User({
        name,
        email,
        password: secPass,
      });
      const Data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(Data, JWT_SECRET);
      await user.save();
      res.json({ authtoken });
    } catch (err) {
      console.error("Error creating user:", err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log("Request body:", req.body);

    try {
      let user = await User.findOne({ email });
      if (!user) {
        console.log("User not found:", email);
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        console.log("Password mismatch for user:", email);
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const Data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(Data, JWT_SECRET);
      res.json({ authtoken });
    } catch (err) {
      console.error("Error logging in user:", err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Get logged-in user details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
