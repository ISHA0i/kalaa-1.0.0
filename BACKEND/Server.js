require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectToMongo = require('./DB');
const productRoutes = require('./routes/ProductRoutes');
const authRoutes = require('./routes/AuthRoutes'); // Import AuthRoutes
const userRoutes = require('./routes/UserRoutes');
const errorHandler = require('./errors/servererror');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // Register AuthRoutes under /api/auth
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/Kalaa', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});