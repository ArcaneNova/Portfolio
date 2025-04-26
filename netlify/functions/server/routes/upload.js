import express from 'express';
import {
  uploadFile,
  deleteFile,
  uploadMultipleFiles,
  uploadBase64
} from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Single file upload
router.post(
  '/',
  protect,
  upload.single('file'),
  handleUploadError,
  uploadFile
);

// Multiple files upload
router.post(
  '/multiple',
  protect,
  upload.array('files', 10), // Max 10 files
  handleUploadError,
  uploadMultipleFiles
);

// Base64 image upload
router.post('/base64', protect, uploadBase64);

// Delete file
router.delete('/:publicId', protect, authorize('admin'), deleteFile);

export default router; 