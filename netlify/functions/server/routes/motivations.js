import express from 'express';
import {
  getMotivations,
  getMotivation,
  getRandomMotivation,
  createMotivation,
  updateMotivation,
  deleteMotivation,
  likeMotivation
} from '../controllers/motivationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get random motivation
router.get('/random', getRandomMotivation);

// Base routes
router
  .route('/')
  .get(getMotivations)
  .post(protect, authorize('admin'), createMotivation);

router
  .route('/:id')
  .get(getMotivation)
  .put(protect, authorize('admin'), updateMotivation)
  .delete(protect, authorize('admin'), deleteMotivation);

// Like motivation
router.put('/:id/like', protect, likeMotivation);

export default router; 