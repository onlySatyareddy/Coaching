const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Batch name is required'],
    trim: true,
    maxlength: [100, 'Batch name cannot exceed 100 characters']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: [true, 'At least one faculty is required']
  }],
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: [true, 'Day is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      validate: {
        validator: function(v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Please provide a valid time in HH:MM format'
      }
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      validate: {
        validator: function(v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Please provide a valid time in HH:MM format'
      }
    }
  }],
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  maxStudents: {
    type: Number,
    required: [true, 'Maximum students is required'],
    min: [1, 'Maximum students must be at least 1'],
    max: [100, 'Maximum students cannot exceed 100']
  },
  currentStudents: {
    type: Number,
    default: 0,
    min: [0, 'Current students cannot be negative']
  },
  batchType: {
    type: String,
    enum: ['regular', 'weekend', 'crash', 'online'],
    default: 'regular'
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Validation: end date should be after start date
batchSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  
  // Validation: current students should not exceed max students
  if (this.currentStudents > this.maxStudents) {
    return next(new Error('Current students cannot exceed maximum students'));
  }
  
  next();
});

// Add indexes for better query performance
batchSchema.index({ course: 1 });
batchSchema.index({ faculty: 1 });
batchSchema.index({ status: 1 });
batchSchema.index({ startDate: 1 });
batchSchema.index({ isActive: 1, batchType: 1 });

module.exports = mongoose.model('Batch', batchSchema);
