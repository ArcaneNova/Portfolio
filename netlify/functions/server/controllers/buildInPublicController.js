import BuildInPublic from '../models/BuildInPublic.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

// @desc    Get all build-in-public posts
// @route   GET /api/build-in-public
// @access  Public
export const getBuildInPublics = async (req, res, next) => {
  try {
    // Initialize query
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude from matching
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string and operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Search functionality
    if (req.query.search) {
      query = BuildInPublic.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { content: { $regex: req.query.search, $options: 'i' } },
          { technologies: { $in: [new RegExp(req.query.search, 'i')] } },
          { tags: { $in: [new RegExp(req.query.search, 'i')] } }
        ]
      });
    } else {
      query = BuildInPublic.find(JSON.parse(queryStr));
    }

    // Filter for published posts only for non-admin users
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
    const total = await BuildInPublic.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit).populate('author', 'username profileImage');
    
    // Execute query
    const buildInPublics = await query;
    
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
      count: buildInPublics.length,
      pagination,
      data: buildInPublics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single build-in-public post
// @route   GET /api/build-in-public/:id
// @access  Public
export const getBuildInPublic = async (req, res, next) => {
  try {
    let buildInPublic;
    
    // Check if id is a valid ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      buildInPublic = await BuildInPublic.findById(req.params.id).populate('author', 'username profileImage');
    } else {
      // Try to find by slug
      buildInPublic = await BuildInPublic.findOne({ slug: req.params.id }).populate('author', 'username profileImage');
    }
    
    if (!buildInPublic) {
      return res.status(404).json({
        success: false,
        message: 'Build-in-public post not found'
      });
    }
    
    // Increment view count
    buildInPublic.views += 1;
    await buildInPublic.save();
    
    res.status(200).json({
      success: true,
      data: buildInPublic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new build-in-public post
// @route   POST /api/build-in-public
// @access  Private (Admin)
export const createBuildInPublic = async (req, res, next) => {
  try {
    // Add author
    req.body.author = req.user.id;
    
    // Handle thumbnail upload
    if (req.body.thumbnail && req.body.thumbnail.startsWith('data:image')) {
      const uploadResult = await uploadImage(req.body.thumbnail, 'portfolio/build-in-public');
      req.body.thumbnail = uploadResult.url;
    }
    
    // Handle multiple images upload
    if (req.body.images && Array.isArray(req.body.images)) {
      const uploadedImages = [];
      for (const image of req.body.images) {
        if (image.startsWith('data:image')) {
          const uploadResult = await uploadImage(image, 'portfolio/build-in-public');
          uploadedImages.push(uploadResult.url);
        } else {
          uploadedImages.push(image);
        }
      }
      req.body.images = uploadedImages;
    }
    
    // Create build-in-public post
    const buildInPublic = await BuildInPublic.create(req.body);
    
    res.status(201).json({
      success: true,
      data: buildInPublic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update build-in-public post
// @route   PUT /api/build-in-public/:id
// @access  Private (Admin)
export const updateBuildInPublic = async (req, res, next) => {
  try {
    let buildInPublic = await BuildInPublic.findById(req.params.id);
    
    if (!buildInPublic) {
      return res.status(404).json({
        success: false,
        message: 'Build-in-public post not found'
      });
    }
    
    // Make sure user is the author or admin
    if (buildInPublic.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }
    
    // Handle thumbnail upload
    if (req.body.thumbnail && req.body.thumbnail.startsWith('data:image')) {
      const uploadResult = await uploadImage(req.body.thumbnail, 'portfolio/build-in-public');
      req.body.thumbnail = uploadResult.url;
    }
    
    // Handle multiple images upload
    if (req.body.images && Array.isArray(req.body.images)) {
      const uploadedImages = [];
      for (const image of req.body.images) {
        if (image.startsWith('data:image')) {
          const uploadResult = await uploadImage(image, 'portfolio/build-in-public');
          uploadedImages.push(uploadResult.url);
        } else {
          uploadedImages.push(image);
        }
      }
      req.body.images = uploadedImages;
    }
    
    // Update build-in-public post
    buildInPublic = await BuildInPublic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: buildInPublic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete build-in-public post
// @route   DELETE /api/build-in-public/:id
// @access  Private (Admin)
export const deleteBuildInPublic = async (req, res, next) => {
  try {
    const buildInPublic = await BuildInPublic.findById(req.params.id);
    
    if (!buildInPublic) {
      return res.status(404).json({
        success: false,
        message: 'Build-in-public post not found'
      });
    }
    
    // Make sure user is the author or admin
    if (buildInPublic.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }
    
    await buildInPublic.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add milestone to build-in-public post
// @route   POST /api/build-in-public/:id/milestones
// @access  Private (Admin)
export const addMilestone = async (req, res, next) => {
  try {
    const buildInPublic = await BuildInPublic.findById(req.params.id);
    
    if (!buildInPublic) {
      return res.status(404).json({
        success: false,
        message: 'Build-in-public post not found'
      });
    }
    
    // Make sure user is the author or admin
    if (buildInPublic.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }
    
    // Add milestone
    buildInPublic.milestones.push(req.body);
    
    // Update progress if milestone is completed
    if (req.body.isCompleted) {
      const completedMilestones = buildInPublic.milestones.filter(m => m.isCompleted).length + 1;
      const totalMilestones = buildInPublic.milestones.length + 1;
      buildInPublic.progress = Math.round((completedMilestones / totalMilestones) * 100);
    }
    
    await buildInPublic.save();
    
    res.status(201).json({
      success: true,
      data: buildInPublic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update milestone in build-in-public post
// @route   PUT /api/build-in-public/:id/milestones/:milestoneId
// @access  Private (Admin)
export const updateMilestone = async (req, res, next) => {
  try {
    const buildInPublic = await BuildInPublic.findById(req.params.id);
    
    if (!buildInPublic) {
      return res.status(404).json({
        success: false,
        message: 'Build-in-public post not found'
      });
    }
    
    // Make sure user is the author or admin
    if (buildInPublic.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }
    
    // Find milestone
    const milestone = buildInPublic.milestones.id(req.params.milestoneId);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }
    
    // Update milestone fields
    Object.keys(req.body).forEach(key => {
      milestone[key] = req.body[key];
    });
    
    // If status changed to completed, add completedAt date
    if (req.body.isCompleted && !milestone.completedAt) {
      milestone.completedAt = Date.now();
    }
    
    // Recalculate progress
    const completedMilestones = buildInPublic.milestones.filter(m => m.isCompleted).length;
    const totalMilestones = buildInPublic.milestones.length;
    buildInPublic.progress = Math.round((completedMilestones / totalMilestones) * 100);
    
    await buildInPublic.save();
    
    res.status(200).json({
      success: true,
      data: buildInPublic
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete milestone from build-in-public post
// @route   DELETE /api/build-in-public/:id/milestones/:milestoneId
// @access  Private (Admin)
export const deleteMilestone = async (req, res, next) => {
  try {
    const buildInPublic = await BuildInPublic.findById(req.params.id);
    
    if (!buildInPublic) {
      return res.status(404).json({
        success: false,
        message: 'Build-in-public post not found'
      });
    }
    
    // Make sure user is the author or admin
    if (buildInPublic.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }
    
    // Find milestone
    const milestone = buildInPublic.milestones.id(req.params.milestoneId);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }
    
    // Remove milestone
    milestone.deleteOne();
    
    // Recalculate progress if there are milestones left
    if (buildInPublic.milestones.length > 0) {
      const completedMilestones = buildInPublic.milestones.filter(m => m.isCompleted).length;
      const totalMilestones = buildInPublic.milestones.length;
      buildInPublic.progress = Math.round((completedMilestones / totalMilestones) * 100);
    } else {
      buildInPublic.progress = 0;
    }
    
    await buildInPublic.save();
    
    res.status(200).json({
      success: true,
      data: buildInPublic
    });
  } catch (error) {
    next(error);
  }
}; 