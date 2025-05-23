import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Set up Express app
const app = express();

// CORS middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Add CORS preflight handler
app.options('*', cors());

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Log all requests
app.use((req, res, next) => {
  console.log(`INDEX FUNCTION: ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('Body:', req.method !== 'GET' ? JSON.stringify(req.body) : '[GET request]');
  
  // Add CORS headers to every response
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  
  next();
});

// Direct login handler
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Processing login request in index function');
    console.log('Raw request body:', req.body);
    console.log('Content type:', req.headers['content-type']);
    console.log('Method:', req.method);
    
    // If the request body is empty but this is a POST request, try to get data from query
    let email = req.body?.email;
    let password = req.body?.password;
    
    // If no body, try to parse from a string if that's how it came in
    if (!email && !password && typeof req.body === 'string') {
      try {
        const parsedBody = JSON.parse(req.body);
        email = parsedBody.email;
        password = parsedBody.password;
        console.log('Parsed body from string:', parsedBody);
      } catch (e) {
        console.log('Failed to parse body from string:', e.message);
      }
    }
    
    // If still no body, check URL params
    if (!email && !password) {
      email = req.query.email;
      password = req.query.password;
      console.log('Using query parameters as fallback');
    }
    
    // Validate inputs
    if (!email || !password) {
      console.log('Missing email or password. Email:', email, 'Password present:', !!password);
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
        debug: {
          bodyType: typeof req.body,
          bodyEmpty: Object.keys(req.body || {}).length === 0,
          method: req.method,
          contentType: req.headers['content-type']
        }
      });
    }

    console.log(`Login attempt with email: ${email}`);

    // Always allow admin test account for debugging
    if (email === 'admin@example.com' && password === 'password123') {
      console.log('Using test admin credentials - successful login');
      
      // Generate token
      const token = jwt.sign(
        { id: 'admin123', role: 'admin' },
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
      
      // Send success response
      res.cookie('token', token, cookieOptions);
      return res.status(200).json({
        success: true,
        message: 'Login successful via index function',
        token,
        user: {
          _id: 'admin123',
          username: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        }
      });
    }
    
    // Regular user login would check the database here
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Try admin@example.com/password123 for testing.'
    });
  } catch (error) {
    console.error('Login error in index function:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
      stack: error.stack
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Index function is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB (optional, only if you need database access)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected in index function'))
    .catch(err => console.error('MongoDB connection error in index function:', err.message));
}

// Export the serverless handler
export const handler = serverless(app); 