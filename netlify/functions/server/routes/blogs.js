import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  deleteComment
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Base routes
router
  .route('/')
  .get(getBlogs)
  .post(protect, authorize('admin'), createBlog);

router
  .route('/:id')
  .get(getBlog)
  .put(protect, authorize('admin'), updateBlog)
  .delete(protect, authorize('admin'), deleteBlog);

// Like blog
router.put('/:id/like', protect, likeBlog);

// Comment routes
router
  .route('/:id/comments')
  .post(protect, addComment);

router
  .route('/:id/comments/:commentId')
  .delete(protect, deleteComment);

export default router; 