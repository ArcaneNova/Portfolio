import Task from '../models/Task.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    // Initialize query
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude from matching
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'category', 'priority', 'status', 'dueDate'];
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Add user filter (users can only see their own tasks)
    reqQuery.user = req.user.id;
    
    // Create query string and operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Base query
    query = Task.find(JSON.parse(queryStr));
    
    // Category filter
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }
    
    // Priority filter
    if (req.query.priority) {
      query = query.find({ priority: req.query.priority });
    }
    
    // Status filter
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }
    
    // Due date filter
    if (req.query.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const week = new Date(today);
      week.setDate(week.getDate() + 7);
      
      if (req.query.dueDate === 'today') {
        query = query.find({
          dueDate: {
            $gte: today,
            $lt: tomorrow
          }
        });
      } else if (req.query.dueDate === 'week') {
        query = query.find({
          dueDate: {
            $gte: today,
            $lt: week
          }
        });
      } else if (req.query.dueDate === 'overdue') {
        query = query.find({
          dueDate: { $lt: today },
          status: { $ne: 'completed' }
        });
      }
    }
    
    // Search functionality
    if (req.query.search) {
      query = query.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { tags: { $in: [new RegExp(req.query.search, 'i')] } }
        ]
      });
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
      // Default sort: first by priority (high to low), then by due date (closest first)
      query = query.sort('-priority dueDate');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Get total count based on filter
    const countQuery = { ...JSON.parse(queryStr) };
    if (req.query.category) countQuery.category = req.query.category;
    if (req.query.priority) countQuery.priority = req.query.priority;
    if (req.query.status) countQuery.status = req.query.status;
    
    const total = await Task.countDocuments(countQuery);
    
    query = query.skip(startIndex).limit(limit).populate('projectRef', 'title').populate('blogRef', 'title');
    
    // Execute query
    const tasks = await query;
    
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
      count: tasks.length,
      pagination,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's tasks
// @route   GET /api/tasks/today
// @access  Private
export const getTodaysTasks = async (req, res, next) => {
  try {
    // Use the static method we defined in the model
    const tasks = await Task.findTodaysTasks(req.user.id).populate('projectRef', 'title').populate('blogRef', 'title');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overdue tasks
// @route   GET /api/tasks/overdue
// @access  Private
export const getOverdueTasks = async (req, res, next) => {
  try {
    // Use the static method we defined in the model
    const tasks = await Task.findOverdueTasks(req.user.id).populate('projectRef', 'title').populate('blogRef', 'title');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task stats
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res, next) => {
  try {
    // Get counts for various task states
    const stats = {
      total: await Task.countDocuments({ user: req.user.id }),
      pending: await Task.countDocuments({ user: req.user.id, status: 'pending' }),
      inProgress: await Task.countDocuments({ user: req.user.id, status: 'in-progress' }),
      completed: await Task.countDocuments({ user: req.user.id, status: 'completed' }),
      
      // Category counts
      byCategory: {
        project: await Task.countDocuments({ user: req.user.id, category: 'project' }),
        blog: await Task.countDocuments({ user: req.user.id, category: 'blog' }),
        learning: await Task.countDocuments({ user: req.user.id, category: 'learning' }),
        personal: await Task.countDocuments({ user: req.user.id, category: 'personal' }),
        other: await Task.countDocuments({ user: req.user.id, category: 'other' })
      },
      
      // Priority counts
      byPriority: {
        low: await Task.countDocuments({ user: req.user.id, priority: 'low' }),
        medium: await Task.countDocuments({ user: req.user.id, priority: 'medium' }),
        high: await Task.countDocuments({ user: req.user.id, priority: 'high' }),
        urgent: await Task.countDocuments({ user: req.user.id, priority: 'urgent' })
      }
    };
    
    // Get today's and overdue task counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    stats.today = await Task.countDocuments({
      user: req.user.id,
      dueDate: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    stats.overdue = await Task.countDocuments({
      user: req.user.id,
      dueDate: { $lt: today },
      status: { $ne: 'completed' }
    });
    
    // Get tasks completed today
    stats.completedToday = await Task.countDocuments({
      user: req.user.id,
      status: 'completed',
      completedAt: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectRef', 'title')
      .populate('blogRef', 'title');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Make sure user owns the task
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Create task
    const task = await Task.create(req.body);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Make sure user owns the task
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }
    
    // Update task
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Make sure user owns the task
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }
    
    await task.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add checklist item to task
// @route   POST /api/tasks/:id/checklist
// @access  Private
export const addChecklistItem = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Make sure user owns the task
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }
    
    // Add checklist item
    task.checklist.push({
      text: req.body.text,
      isCompleted: req.body.isCompleted || false
    });
    
    await task.save();
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update checklist item
// @route   PUT /api/tasks/:id/checklist/:itemId
// @access  Private
export const updateChecklistItem = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Make sure user owns the task
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }
    
    // Find checklist item
    const item = task.checklist.id(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found'
      });
    }
    
    // Update item
    item.text = req.body.text || item.text;
    item.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : item.isCompleted;
    
    await task.save();
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete checklist item
// @route   DELETE /api/tasks/:id/checklist/:itemId
// @access  Private
export const deleteChecklistItem = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Make sure user owns the task
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }
    
    // Find checklist item
    const item = task.checklist.id(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found'
      });
    }
    
    // Remove item
    item.deleteOne();
    await task.save();
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}; 