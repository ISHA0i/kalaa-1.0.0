const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Kalaa';

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Propagate the error
  }
};

module.exports = connectToMongo;