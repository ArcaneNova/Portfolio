import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  dueDate: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['project', 'blog', 'learning', 'personal', 'other'],
    default: 'other'
  },
  projectRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  blogRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reminders: [{
    date: Date,
    sent: {
      type: Boolean,
      default: false
    }
  }],
  notes: [{ 
    text: String, 
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  checklist: [{
    text: String,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  tags: [String],
  timeEstimate: Number, // In minutes
  timeSpent: {
    type: Number,
    default: 0
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date
  },
  completedAt: Date
}, { timestamps: true });

// Add auto-completion date when status changes to completed
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Create today's tasks helper method
taskSchema.statics.findTodaysTasks = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    user: userId,
    $or: [
      { 
        dueDate: {
          $gte: today,
          $lt: tomorrow
        }
      },
      {
        status: {
          $in: ['pending', 'in-progress']
        }
      }
    ]
  }).sort({ priority: -1, dueDate: 1 });
};

// Create overdue tasks helper method
taskSchema.statics.findOverdueTasks = function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    user: userId,
    dueDate: { $lt: today },
    status: { $in: ['pending', 'in-progress'] }
  }).sort({ dueDate: 1, priority: -1 });
};

const Task = mongoose.model('Task', taskSchema);

export default Task; 