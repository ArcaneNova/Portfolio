import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTodaysTasks,
  getOverdueTasks,
  getTaskStats,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get special task collections
router.get('/today', protect, getTodaysTasks);
router.get('/overdue', protect, getOverdueTasks);
router.get('/stats', protect, getTaskStats);

// Base routes
router
  .route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

// Checklist routes
router
  .route('/:id/checklist')
  .post(protect, addChecklistItem);

router
  .route('/:id/checklist/:itemId')
  .put(protect, updateChecklistItem)
  .delete(protect, deleteChecklistItem);

export default router; 