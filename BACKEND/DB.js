const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/demo_by_me";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

module.exports = connectToMongo;
