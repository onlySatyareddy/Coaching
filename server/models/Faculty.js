const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Faculty name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required']
  },
  specialization: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  image: {
    type: String,
    required: true
  },
  achievements: [{
    title: String,
    year: Number,
    description: String
  }],
  socialLinks: {
    linkedin: String,
    twitter: String,
    website: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
facultySchema.index({ name: 'text', specialization: 'text' });

module.exports = mongoose.model('Faculty', facultySchema);
