import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

// Import auth controllers directly
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword
} from '../../server/controllers/authController.js';
import { protect } from '../../server/middleware/auth.js';

// Load environment variables (will use Netlify environment variables in production)
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Set up Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Log request for debugging
app.use((req, res, next) => {
  console.log(`AUTH FUNCTION: ${req.method} ${req.path}`);
  console.log('Request Body:', JSON.stringify(req.body));
  console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set');
  console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set');
  next();
});

// Define auth routes directly
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Use the router
app.use('/', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Auth API is running' });
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Auth function error:', err.stack);
  
  // Check for specific error types
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
  .then(() => console.log('MongoDB connected for auth function'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create serverless handler
export const handler = serverless(app);