require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./DB');
const productRoutes = require('./routes/ProductRoutes');
const errorHandler = require('./errors/servererror');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectToMongo();
    
    // Setup middleware
    app.use(cors());
    app.use(express.json());
    app.use('/api/products', productRoutes);
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();