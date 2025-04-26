import fs from 'fs';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private
export const uploadFile = async (req, res, next) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }
    
    // Get folder from query parameter or default to 'general'
    const folder = req.query.folder || 'general';
    
    // Get file path
    const filePath = req.file.path;
    
    // Upload to Cloudinary
    const result = await uploadImage(filePath, `portfolio/${folder}`);
    
    // Delete local file after upload
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    // If there's an error, delete the local file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error deleting local file:', err);
      }
    }
    
    next(error);
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private
export const deleteFile = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    
    // Delete from Cloudinary
    const result = await deleteImage(publicId);
    
    if (result.result !== 'ok') {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one file'
      });
    }
    
    // Get folder from query parameter or default to 'general'
    const folder = req.query.folder || 'general';
    
    // Upload each file to Cloudinary
    const uploadPromises = req.files.map(async (file) => {
      const result = await uploadImage(file.path, `portfolio/${folder}`);
      
      // Delete local file after upload
      fs.unlinkSync(file.path);
      
      return result;
    });
    
    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    // If there's an error, delete any local files that may exist
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error('Error deleting local file:', err);
        }
      });
    }
    
    next(error);
  }
};

// @desc    Upload base64 image to Cloudinary
// @route   POST /api/upload/base64
// @access  Private
export const uploadBase64 = async (req, res, next) => {
  try {
    // Check if base64 string exists
    if (!req.body.image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a base64 image'
      });
    }
    
    // Get folder from query parameter or default to 'general'
    const folder = req.query.folder || 'general';
    
    // Upload to Cloudinary
    const result = await uploadImage(req.body.image, `portfolio/${folder}`);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}; 