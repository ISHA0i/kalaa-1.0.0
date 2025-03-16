const connectToMongo = require("./DB");
connectToMongo();

const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Available Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/notes", require("./routes/notes"));

// Start the server
app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});
