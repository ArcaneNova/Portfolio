import Blog from '../models/Blog.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
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
      query = Blog.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { content: { $regex: req.query.search, $options: 'i' } },
          { tags: { $regex: req.query.search, $options: 'i' } }
        ]
      });
    } else {
      query = Blog.find(JSON.parse(queryStr));
    }

    // Filter for published blogs only for non-admin users
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
    const total = await Blog.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit).populate('author', 'username profileImage');
    
    // Execute query
    const blogs = await query;
    
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
      count: blogs.length,
      pagination,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req, res, next) => {
  try {
    let blog;
    
    // Check if id is a valid ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(req.params.id).populate('author', 'username profileImage');
    } else {
      // Try to find by slug
      blog = await Blog.findOne({ slug: req.params.id }).populate('author', 'username profileImage');
    }
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment view count
    blog.views += 1;
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private (Admin)
export const createBlog = async (req, res, next) => {
  try {
    // Add author info
    req.body.author = req.user.id;
    
    // Handle cover image upload
    if (req.body.coverImage && req.body.coverImage.startsWith('data:image')) {
      const uploadResult = await uploadImage(req.body.coverImage, 'portfolio/blogs');
      req.body.coverImage = uploadResult.url;
    }
    
    // Create blog
    const blog = await Blog.create(req.body);
    
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Make sure user is the blog author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }
    
    // Handle cover image upload
    if (req.body.coverImage && req.body.coverImage.startsWith('data:image')) {
      const uploadResult = await uploadImage(req.body.coverImage, 'portfolio/blogs');
      req.body.coverImage = uploadResult.url;
    }
    
    // Update blog
    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin or Author)
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Make sure user is the blog author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }
    
    await blog.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment likes
    blog.likes += 1;
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: { likes: blog.likes }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Create comment
    const comment = {
      user: req.user.id,
      text: req.body.text
    };
    
    // Add comment to blog
    blog.comments.push(comment);
    await blog.save();
    
    // Populate user data
    const populatedBlog = await Blog.findById(req.params.id).populate({
      path: 'comments.user',
      select: 'username profileImage'
    });
    
    // Get added comment
    const addedComment = populatedBlog.comments[populatedBlog.comments.length - 1];
    
    res.status(201).json({
      success: true,
      data: addedComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment from blog
// @route   DELETE /api/blogs/:id/comments/:commentId
// @access  Private (Admin or Comment Owner)
export const deleteComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Find comment
    const comment = blog.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Make sure user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }
    
    // Remove comment
    comment.deleteOne();
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 