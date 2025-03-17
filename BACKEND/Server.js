require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./DB');
const productRoutes = require('./routes/ProductRoutes');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const errorHandler = require('./errors/servererror');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // Register AuthRoutes
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});