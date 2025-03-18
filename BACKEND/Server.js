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
const { requestLogger, errorLogger } = require('./utils/logger');
const productRoutes = require('./routes/ProductRoutes');
const authRoutes = require('./routes/AuthRoutes'); // Import AuthRoutes
const userRoutes = require('./routes/UserRoutes');
const cartRoutes = require('./routes/CartRoutes');
const errorHandler = require('./errors/servererror');
const { catchAsync } = require('./errors/servererror');
const { ValidationError, NotFoundError } = require('./errors/AppError');

const app = express();
const PORT = process.env.PORT || 5001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(compression()); // Compress all routes
app.use(helmet()); // Security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(limiter); // Apply rate limiting

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
  maxAge: 600 // Cache preflight requests for 10 minutes
};
app.use(cors(corsOptions));

// Configure security middleware
configureSecurityMiddleware(app);

// Request logging
app.use(requestLogger);

// Trust proxy if behind a reverse proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API version prefix
const API_PREFIX = '/api';

// Routes
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes); // Register AuthRoutes under /api/auth
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);

// Example route handler
const createUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  // Validation example
  const error = new ValidationError('Invalid input');
  if (!email) error.addError('email', 'Email is required');
  if (!password) error.addError('password', 'Password is required');
  if (error.validationErrors.length > 0) throw error;

  // Create user...
});

// Example of not found error
const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.json(user);
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error logging
app.use(errorLogger);

// Error Handling Middleware
app.use(errorHandler);

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
      server.close(async () => {
        console.log('Server closed.');
        try {
          await mongoose.connection.close();
          console.log('Database connection closed.');
          process.exit(0);
        } catch (err) {
          console.error('Error closing database connection:', err);
          process.exit(1);
        }
      });

      // Force close if graceful shutdown fails
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