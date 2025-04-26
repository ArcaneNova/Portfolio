import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectPost,
  updateProjectPost,
  deleteProjectPost
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Base routes
router
  .route('/')
  .get(getProjects)
  .post(protect, authorize('admin'), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, authorize('admin'), updateProject)
  .delete(protect, authorize('admin'), deleteProject);

// Project post routes
router
  .route('/:id/posts')
  .post(protect, authorize('admin'), addProjectPost);

router
  .route('/:id/posts/:postId')
  .put(protect, authorize('admin'), updateProjectPost)
  .delete(protect, authorize('admin'), deleteProjectPost);

export default router; 