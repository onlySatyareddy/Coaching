const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['JEE', 'NEET', 'SSC', 'Foundation', 'Board Exams']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  syllabus: [{
    topic: {
      type: String,
      required: true
    },
    chapters: [{
      type: String
    }]
  }],
  batchTimings: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }],
  thumbnail: {
    type: String,
    required: true
  },
  images: [String],
  videos: [{
    title: String,
    url: String,
    duration: String
  }],
  materials: [{
    type: {
      type: String,
      enum: ['pdf', 'video', 'link']
    },
    title: String,
    url: String
  }],
  maxStudents: {
    type: Number,
    default: 50
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  }
}, {
  timestamps: true
});

// Index for search
courseSchema.index({ title: 'text', description: 'text', category: 'text' });

// Virtual for available seats
courseSchema.virtual('availableSeats').get(function() {
  return this.maxStudents - this.enrolledStudents;
});

// Method to enroll student
courseSchema.methods.enrollStudent = function() {
  if (this.enrolledStudents >= this.maxStudents) {
    throw new Error('Course is full');
  }
  this.enrolledStudents += 1;
  return this.save();
};

module.exports = mongoose.model('Course', courseSchema);
