import Motivation from '../models/Motivation.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

// @desc    Get all motivational content
// @route   GET /api/motivations
// @access  Public
export const getMotivations = async (req, res, next) => {
  try {
    // Initialize query
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude from matching
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'type'];
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string and operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Base query
    query = Motivation.find(JSON.parse(queryStr));
    
    // Filter by type if specified
    if (req.query.type) {
      query = query.find({ type: req.query.type });
    }
    
    // Search functionality
    if (req.query.search) {
      query = query.find({
        $or: [
          { content: { $regex: req.query.search, $options: 'i' } },
          { source: { $regex: req.query.search, $options: 'i' } },
          { author: { $regex: req.query.search, $options: 'i' } },
          { movie: { $regex: req.query.search, $options: 'i' } },
          { tags: { $regex: req.query.search, $options: 'i' } }
        ]
      });
    }

    // Filter for published content only for non-admin users
    if (!req.user || req.user.role !== 'admin') {
      query = query.find({ isPublished: true });
    }
    
    // Select specific fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-publishedAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Get total count based on filter
    const countQuery = { ...JSON.parse(queryStr) };
    if (req.query.type) {
      countQuery.type = req.query.type;
    }
    if (!req.user || req.user.role !== 'admin') {
      countQuery.isPublished = true;
    }
    
    const total = await Motivation.countDocuments(countQuery);
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const motivations = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: motivations.length,
      pagination,
      data: motivations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get random motivational content
// @route   GET /api/motivations/random
// @access  Public
export const getRandomMotivation = async (req, res, next) => {
  try {
    // Get type from query
    const type = req.query.type;
    
    // Base query
    const query = { isPublished: true };
    
    // Add type filter if specified
    if (type) {
      query.type = type;
    }
    
    // Get count of documents
    const count = await Motivation.countDocuments(query);
    
    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No motivational content found'
      });
    }
    
    // Get random index
    const random = Math.floor(Math.random() * count);
    
    // Get random document
    const motivation = await Motivation.findOne(query).skip(random);
    
    // Increment view count
    motivation.views += 1;
    await motivation.save();
    
    res.status(200).json({
      success: true,
      data: motivation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single motivational content
// @route   GET /api/motivations/:id
// @access  Public
export const getMotivation = async (req, res, next) => {
  try {
    const motivation = await Motivation.findById(req.params.id);
    
    if (!motivation) {
      return res.status(404).json({
        success: false,
        message: 'Motivational content not found'
      });
    }
    
    // Increment view count
    motivation.views += 1;
    await motivation.save();
    
    res.status(200).json({
      success: true,
      data: motivation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new motivational content
// @route   POST /api/motivations
// @access  Private (Admin)
export const createMotivation = async (req, res, next) => {
  try {
    // Handle image upload for image type
    if (req.body.type === 'image' && req.body.imageUrl && req.body.imageUrl.startsWith('data:image')) {
      const uploadResult = await uploadImage(req.body.imageUrl, 'portfolio/motivations');
      req.body.imageUrl = uploadResult.url;
    }
    
    // Create motivation
    const motivation = await Motivation.create(req.body);
    
    res.status(201).json({
      success: true,
      data: motivation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update motivational content
// @route   PUT /api/motivations/:id
// @access  Private (Admin)
export const updateMotivation = async (req, res, next) => {
  try {
    let motivation = await Motivation.findById(req.params.id);
    
    if (!motivation) {
      return res.status(404).json({
        success: false,
        message: 'Motivational content not found'
      });
    }
    
    // Handle image upload for image type
    if (req.body.type === 'image' && req.body.imageUrl && req.body.imageUrl.startsWith('data:image')) {
      const uploadResult = await uploadImage(req.body.imageUrl, 'portfolio/motivations');
      req.body.imageUrl = uploadResult.url;
    }
    
    // Update motivation
    motivation = await Motivation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: motivation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete motivational content
// @route   DELETE /api/motivations/:id
// @access  Private (Admin)
export const deleteMotivation = async (req, res, next) => {
  try {
    const motivation = await Motivation.findById(req.params.id);
    
    if (!motivation) {
      return res.status(404).json({
        success: false,
        message: 'Motivational content not found'
      });
    }
    
    // Delete image from Cloudinary if it's an image type
    if (motivation.type === 'image' && motivation.imageUrl) {
      try {
        // Extract public ID from the URL
        const publicId = motivation.imageUrl.split('/').pop().split('.')[0];
        await deleteImage(`portfolio/motivations/${publicId}`);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }
    
    await motivation.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like motivational content
// @route   PUT /api/motivations/:id/like
// @access  Private
export const likeMotivation = async (req, res, next) => {
  try {
    const motivation = await Motivation.findById(req.params.id);
    
    if (!motivation) {
      return res.status(404).json({
        success: false,
        message: 'Motivational content not found'
      });
    }
    
    // Increment likes
    motivation.likes += 1;
    await motivation.save();
    
    res.status(200).json({
      success: true,
      data: { likes: motivation.likes }
    });
  } catch (error) {
    next(error);
  }
}; 