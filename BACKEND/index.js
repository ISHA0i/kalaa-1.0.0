const connectToMongo = require("./DB");
connectToMongo();

require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Available Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/notes", require("./routes/notes"));

// Start the server
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
