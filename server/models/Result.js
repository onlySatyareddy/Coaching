const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  exam: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true,
    maxlength: [100, 'Exam name cannot exceed 100 characters']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  rank: {
    type: Number,
    required: [true, 'Rank is required'],
    min: [1, 'Rank must be at least 1']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [1, 'Total marks must be at least 1']
  },
  percentage: {
    type: Number,
    required: [true, 'Percentage is required'],
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  image: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  examDate: {
    type: Date,
    required: [true, 'Exam date is required']
  }
}, {
  timestamps: true
});

// Calculate percentage before saving
resultSchema.pre('save', function(next) {
  if (this.score && this.totalMarks) {
    this.percentage = Math.round((this.score / this.totalMarks) * 100);
  }
  next();
});

// Add indexes for better query performance
resultSchema.index({ student: 1, course: 1 });
resultSchema.index({ course: 1, examDate: -1 });
resultSchema.index({ featured: 1, isActive: 1 });
resultSchema.index({ rank: 1 });

module.exports = mongoose.model('Result', resultSchema);
