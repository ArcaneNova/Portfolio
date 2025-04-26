import mongoose from 'mongoose';

const buildInPublicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
  },
  images: [String],
  codeSnippets: [{
    language: String,
    code: String,
    description: String
  }],
  technologies: [String],
  demoUrl: String,
  repoUrl: String,
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'idea'],
    default: 'in-progress'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  category: {
    type: String,
    default: 'Web Development'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  milestones: [{
    title: String,
    description: String,
    completedAt: Date,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  timeline: [{
    date: {
      type: Date,
      default: Date.now
    },
    title: String,
    description: String
  }],
  challenges: {
    type: String,
    default: ''
  },
  learnings: {
    type: String,
    default: ''
  },
  nextSteps: {
    type: String,
    default: ''
  },
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
  },
  featured: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Create a text index for search functionality
buildInPublicSchema.index({ 
  title: 'text', 
  description: 'text', 
  content: 'text',
  technologies: 'text',
  tags: 'text'
});

// Generate slug from title
buildInPublicSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  }
  next();
});

const BuildInPublic = mongoose.model('BuildInPublic', buildInPublicSchema);

export default BuildInPublic; 