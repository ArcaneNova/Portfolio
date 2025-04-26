import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required']
  },
  images: [String],
  videoUrl: String,
  tags: [String],
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required']
  },
  thumbnail: {
    type: String,
    required: [true, 'Project thumbnail is required']
  },
  images: [String],
  demoUrl: String,
  sourceCodeUrl: String,
  technologies: [String],
  category: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'ai', 'game', 'other'],
    default: 'web'
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'completed'
  },
  startDate: Date,
  endDate: Date,
  posts: [postSchema],
  challenges: {
    type: String,
    default: ''
  },
  learnings: {
    type: String,
    default: ''
  },
  collaborators: [String],
  slug: {
    type: String,
    required: true,
    unique: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Create a text index for search functionality
projectSchema.index({ 
  title: 'text', 
  description: 'text', 
  shortDescription: 'text',
  technologies: 'text'
});

// Generate slug from title
projectSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project; 