import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';
import path from 'path';

// Routes
import projectRoutes from '../../server/routes/projects.js';
import blogRoutes from '../../server/routes/blogs.js';
import motivationRoutes from '../../server/routes/motivations.js';
import buildInPublicRoutes from '../../server/routes/buildInPublic.js';
import taskRoutes from '../../server/routes/tasks.js';
import uploadRoutes from '../../server/routes/upload.js';

// Load environment variables (will use Netlify environment variables in production)
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Log environment variables (excluding sensitive ones)
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('PORT:', process.env.PORT);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Use CLIENT_URL from environment if available
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '30mb' }));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());

// Add detailed logging middleware
app.use((req, res, next) => {
  console.log(`SERVER FUNCTION: ${req.method} ${req.path}`);
  console.log('Request Headers:', JSON.stringify(req.headers));
  if (req.method !== 'GET') {
    console.log('Request Body:', JSON.stringify(req.body));
  }
  next();
});

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/motivations', motivationRoutes);
app.use('/api/build-in-public', buildInPublicRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Route for auth-related paths that somehow reach this function
app.all('/api/auth/*', (req, res) => {
  console.log('Auth request received in server function, redirecting to auth function');
  res.status(307).redirect(`/.netlify/functions/auth/${req.path.replace('/api/auth/', '')}`);
});

// Add error handling middleware 
app.use((err, req, res, next) => {
  console.error('Server function error:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(val => val.message)
    });
  }
  
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }
  
  // Generic error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Export the serverless function
export const handler = serverless(app); 