import Project from '../models/Project.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
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
      query = Project.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { technologies: { $regex: req.query.search, $options: 'i' } }
        ]
      });
    } else {
      query = Project.find(JSON.parse(queryStr));
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
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Project.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const projects = await query;
    
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
      count: projects.length,
      pagination,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req, res, next) => {
  try {
    let project;
    
    // Check if id is a valid ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(req.params.id);
    } else {
      // Try to find by slug
      project = await Project.findOne({ slug: req.params.id });
    }
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req, res, next) => {
  try {
    // Handle image upload
    if (req.body.thumbnail && req.body.thumbnail.startsWith('data:image')) {
      const uploadResult = await uploadImage(req.body.thumbnail, 'portfolio/projects');
      req.body.thumbnail = uploadResult.url;
    }
    
    // Handle multiple images upload
    if (req.body.images && Array.isArray(req.body.images)) {
      const uploadedImages = [];
      for (const image of req.body.images) {
        if (image.startsWith('data:image')) {
          const uploadResult = await uploadImage(image, 'portfolio/projects');
          uploadedImages.push(uploadResult.url);
        } else {
          uploadedImages.push(image);
        }
      }
      req.body.images = uploadedImages;
    }
    
    // Create project
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Handle image upload
    if (req.body.thumbnail && req.body.thumbnail.startsWith('data:image')) {
      const uploadResult = await uploadImage(req.body.thumbnail, 'portfolio/projects');
      req.body.thumbnail = uploadResult.url;
    }
    
    // Handle multiple images upload
    if (req.body.images && Array.isArray(req.body.images)) {
      const uploadedImages = [];
      for (const image of req.body.images) {
        if (image.startsWith('data:image')) {
          const uploadResult = await uploadImage(image, 'portfolio/projects');
          uploadedImages.push(uploadResult.url);
        } else {
          uploadedImages.push(image);
        }
      }
      req.body.images = uploadedImages;
    }
    
    // Update project
    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    await project.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add post to project
// @route   POST /api/projects/:id/posts
// @access  Private (Admin)
export const addProjectPost = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Handle image uploads in post
    if (req.body.images && Array.isArray(req.body.images)) {
      const uploadedImages = [];
      for (const image of req.body.images) {
        if (image.startsWith('data:image')) {
          const uploadResult = await uploadImage(image, 'portfolio/projects/posts');
          uploadedImages.push(uploadResult.url);
        } else {
          uploadedImages.push(image);
        }
      }
      req.body.images = uploadedImages;
    }
    
    // Add post to project
    project.posts.push(req.body);
    await project.save();
    
    // Return the newly added post
    const newPost = project.posts[project.posts.length - 1];
    
    res.status(201).json({
      success: true,
      data: newPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project post
// @route   PUT /api/projects/:id/posts/:postId
// @access  Private (Admin)
export const updateProjectPost = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Find post
    const postIndex = project.posts.findIndex(
      post => post._id.toString() === req.params.postId
    );
    
    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Handle image uploads in post
    if (req.body.images && Array.isArray(req.body.images)) {
      const uploadedImages = [];
      for (const image of req.body.images) {
        if (image.startsWith('data:image')) {
          const uploadResult = await uploadImage(image, 'portfolio/projects/posts');
          uploadedImages.push(uploadResult.url);
        } else {
          uploadedImages.push(image);
        }
      }
      req.body.images = uploadedImages;
    }
    
    // Update post fields
    Object.keys(req.body).forEach(key => {
      project.posts[postIndex][key] = req.body[key];
    });
    
    await project.save();
    
    res.status(200).json({
      success: true,
      data: project.posts[postIndex]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project post
// @route   DELETE /api/projects/:id/posts/:postId
// @access  Private (Admin)
export const deleteProjectPost = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Find post
    const postIndex = project.posts.findIndex(
      post => post._id.toString() === req.params.postId
    );
    
    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Remove post
    project.posts.splice(postIndex, 1);
    await project.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 