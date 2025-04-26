import mongoose from 'mongoose';

const motivationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['quote', 'image', 'video'],
    required: [true, 'Motivation type is required']
  },
  content: {
    type: String,
    required: function() {
      return this.type === 'quote';
    }
  },
  imageUrl: {
    type: String,
    required: function() {
      return this.type === 'image';
    }
  },
  videoUrl: {
    type: String,
    required: function() {
      return this.type === 'video';
    }
  },
  source: {
    type: String,
    required: [true, 'Source is required']
  },
  author: {
    type: String,
    default: 'Unknown'
  },
  movie: {
    type: String,
    default: ''
  },
  year: Number,
  character: String,
  tags: [String],
  category: {
    type: String,
    default: 'General'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
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
motivationSchema.index({ 
  content: 'text', 
  source: 'text', 
  author: 'text', 
  movie: 'text',
  tags: 'text'
});

const Motivation = mongoose.model('Motivation', motivationSchema);

export default Motivation; 