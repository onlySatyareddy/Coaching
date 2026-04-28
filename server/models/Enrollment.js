const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'suspended', 'cancelled'],
    default: 'active'
  },
  progress: {
    completedTopics: [{
      type: String
    }],
    completedVideos: [{
      type: String
    }],
    completedMaterials: [{
      type: String
    }],
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    amount: Number,
    paymentId: String,
    paymentDate: Date,
    method: {
      type: String,
      enum: ['razorpay', 'stripe', 'offline'],
      default: 'razorpay'
    }
  },
  attendance: [{
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present'
    }
  }],
  certificates: [{
    name: String,
    url: String,
    issuedDate: Date
  }],
  notes: [{
    title: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Ensure unique enrollment
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
