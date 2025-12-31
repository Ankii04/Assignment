import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    unique: true,
    trim: true
  },
  author: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  publishedDate: {
    type: Date
  },
  excerpt: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  isUpdated: {
    type: Boolean,
    default: false
  },
  originalArticleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    default: null
  },
  references: [{
    type: String,
    trim: true
  }],
  metadata: {
    scrapedAt: {
      type: Date,
      default: Date.now
    },
    wordCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
articleSchema.index({ isUpdated: 1, createdAt: -1 });
// Note: url field already has unique: true which creates an index automatically

// Calculate word count before saving
articleSchema.pre('save', function () {
  if (this.content) {
    this.metadata.wordCount = this.content.split(/\s+/).length;
  }
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
