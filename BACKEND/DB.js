// filepath: d:\git clone\kalaa-1.0.0\BACKEND\DB.js
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true
};

let retryCount = 0;
const MAX_RETRIES = 5;

const connectToMongo = async () => {
  try {
    // Validate MongoDB URI
    if (!mongoURI) {
      console.error('MongoDB URI is not defined in environment variables');
      return process.exit(1);
    }

    // Handle initial connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // Handle errors after initial connection
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    // Clean up resources on process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    // Connect to MongoDB
    await mongoose.connect(mongoURI, mongoOptions);
    
    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    if (err.name === 'MongooseServerSelectionError' && retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying connection (${retryCount}/${MAX_RETRIES}) in 5 seconds...`);
      setTimeout(connectToMongo, 5000);
    } else {
      process.exit(1); // Exit on other errors or if retry limit is reached
    }
  }
};

module.exports = connectToMongo;