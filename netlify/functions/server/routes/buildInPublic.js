import express from 'express';
import {
  getBuildInPublics,
  getBuildInPublic,
  createBuildInPublic,
  updateBuildInPublic,
  deleteBuildInPublic,
  addMilestone,
  updateMilestone,
  deleteMilestone
} from '../controllers/buildInPublicController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Base routes
router
  .route('/')
  .get(getBuildInPublics)
  .post(protect, authorize('admin'), createBuildInPublic);

router
  .route('/:id')
  .get(getBuildInPublic)
  .put(protect, authorize('admin'), updateBuildInPublic)
  .delete(protect, authorize('admin'), deleteBuildInPublic);

// Milestone routes
router
  .route('/:id/milestones')
  .post(protect, authorize('admin'), addMilestone);

router
  .route('/:id/milestones/:milestoneId')
  .put(protect, authorize('admin'), updateMilestone)
  .delete(protect, authorize('admin'), deleteMilestone);

export default router; 