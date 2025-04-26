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

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in serverless function
  credentials: true
}));
app.use(express.json({ limit: '30mb' }));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/motivations', motivationRoutes);
app.use('/api/build-in-public', buildInPublicRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);

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