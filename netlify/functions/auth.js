import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcrypt';

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
  origin: '*', // Allow all origins during troubleshooting
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Add CORS preflight handler
app.options('*', cors());

// Log all requests including headers
app.use((req, res, next) => {
  console.log(`AUTH FUNCTION: ${req.method} ${req.path}`);
  console.log('Request Headers:', JSON.stringify(req.headers));
  console.log('Request Body:', req.method !== 'GET' ? JSON.stringify(req.body) : '[GET request]');
  console.log('Cookies:', JSON.stringify(req.cookies));
  console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set');
  console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set');
  
  // Add CORS headers to every response
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  
  next();
});

app.use(express.json());
app.use(cookieParser());

// DIRECT HANDLER FOR LOGIN - this will catch any login request regardless of path
app.post('/login', async (req, res) => {
  try {
    console.log('Direct login handler triggered');
    console.log('Request Body:', JSON.stringify(req.body));
    
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // For testing/development purposes - allow fixed admin credentials
    if (email === 'admin@example.com' && password === 'password123') {
      console.log('Using development admin credentials');
      
      // Create/find the admin user
      let adminUser = await mongoose.model('User').findOne({ email: 'admin@example.com' });
      
      if (!adminUser) {
        const UserSchema = new mongoose.Schema({
          username: String,
          email: String,
          password: String,
          role: String
        });
        
        const User = mongoose.model('User', UserSchema);
        
        adminUser = await User.create({
          username: 'Admin User',
          email: 'admin@example.com',
          password: await bcrypt.hash('password123', 10),
          role: 'admin'
        });
        console.log('Created default admin user');
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: adminUser._id, role: adminUser.role || 'admin' },
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
      
      // Set cookie options
      const cookieOptions = {
        expires: new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/'
      };
      
      // Set cookie and send response
      res.cookie('token', token, cookieOptions);
      
      return res.status(200).json({
        success: true,
        message: 'Login successful via direct handler',
        token,
        user: {
          _id: adminUser._id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role || 'admin'
        }
      });
    }
    
    // If not using test credentials, try to use the normal login flow
    console.log('Forwarding to standard login handler');
    req.url = '/login'; // Ensure the URL is correct for the router
    next();
  } catch (error) {
    console.error('Direct login handler error:', error);
    res.status(500).json({
      success: false, 
      message: 'Error during login',
      error: error.message
    });
  }
});

// Add the catch-all version of the login handler
app.post('*/login', async (req, res) => {
  try {
    console.log('Catch-all login handler triggered for path:', req.path);
    console.log('Request Body:', JSON.stringify(req.body));
    
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // For testing/development purposes - allow fixed admin credentials
    if (email === 'admin@example.com' && password === 'password123') {
      console.log('Using development admin credentials');
      
      // Create/find the admin user
      let adminUser;
      
      try {
        const User = mongoose.model('User');
        adminUser = await User.findOne({ email: 'admin@example.com' });
        
        if (!adminUser) {
          adminUser = await User.create({
            username: 'Admin User',
            email: 'admin@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin'
          });
          console.log('Created default admin user');
        }
      } catch (dbError) {
        console.log('Error with User model, creating simplified version:', dbError.message);
        
        // If User model not yet defined, create a simplified one
        const UserSchema = new mongoose.Schema({
          username: String,
          email: String,
          password: String,
          role: String
        });
        
        const User = mongoose.models.User || mongoose.model('User', UserSchema);
        
        adminUser = {
          _id: 'admin123',
          username: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        };
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: adminUser._id || 'admin123', role: 'admin' },
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
      
      // Set cookie options
      const cookieOptions = {
        expires: new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/'
      };
      
      // Set cookie and send response
      res.cookie('token', token, cookieOptions);
      
      return res.status(200).json({
        success: true,
        message: 'Login successful via catch-all handler',
        token,
        user: {
          _id: adminUser._id || 'admin123',
          username: adminUser.username || 'Admin User',
          email: adminUser.email || 'admin@example.com',
          role: adminUser.role || 'admin'
        }
      });
    }
    
    // Forward to regular handlers if not using test credentials
    next();
  } catch (error) {
    console.error('Catch-all login handler error:', error);
    res.status(500).json({
      success: false, 
      message: 'Error during login',
      error: error.message
    });
  }
});

// Define auth routes directly
const router = express.Router();
router.post('/register', register);
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