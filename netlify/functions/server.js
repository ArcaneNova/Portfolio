import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';

// Routes
import authRoutes from '../../server/routes/auth.js';
import projectRoutes from '../../server/routes/projects.js';
import blogRoutes from '../../server/routes/blogs.js';
import motivationRoutes from '../../server/routes/motivations.js';
import buildInPublicRoutes from '../../server/routes/buildInPublic.js';
import taskRoutes from '../../server/routes/tasks.js';
import uploadRoutes from '../../server/routes/upload.js';

// Load environment variables
dotenv.config();

const app = express();

// Log environment variables (excluding sensitive ones)
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('PORT:', process.env.PORT);

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in serverless function
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '30mb' }));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
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