require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectToMongo = require('./DB');
const { configureSecurityMiddleware } = require('./middleware/security');
const productRoutes = require('./routes/ProductRoutes');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const cartRoutes = require('./routes/CartRoutes');
const { catchAsync } = require('./errors/servererror');
const nodemailer = require('nodemailer');
// const { ValidationError, NotFoundError } = require('./errors/AppError');

const app = express();
const PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${PORT}`;
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(compression());
app.use(helmet());
app.use(mongoSanitize());
app.use(limiter);

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
};
app.use(cors(corsOptions));

// Configure security middleware
configureSecurityMiddleware(app);

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// API version prefix
const API_PREFIX = '/api';

// Global routes
app.get(`${API_PREFIX}/featured-artworks`, async (req, res) => {
  try {
    // Get products with featured flag if any model has it
    const Product = require('./models/ProductModel');
    const featuredProducts = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('-__v')
      .lean();
    
    // If no featured products, return the newest products
    if (featuredProducts.length === 0) {
      const newestProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select('-__v')
        .lean();
      
      console.log('No featured products, returning newest products');
      return res.status(200).json(newestProducts);
    }
    
    console.log('Featured products retrieved successfully', { count: featuredProducts.length });
    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Routes
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);

// Handle 404
const { errorHandler, notFoundHandler } = require('./errors/servererror');
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

// Simplified error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  
  res.status(statusCode).json({
    status,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB and Start Server
const startServer = async () => {
  try {
    await connectToMongo();
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Received shutdown signal. Closing server...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});