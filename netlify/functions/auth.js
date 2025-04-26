import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

// Import auth routes from server directory
import authRoutes from '../../server/routes/auth.js';

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

// Use the auth routes from server directory
app.use('/', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Auth API is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for auth function'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create serverless handler
export const handler = serverless(app);