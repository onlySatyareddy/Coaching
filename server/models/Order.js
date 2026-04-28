const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
  orderNumber: {
    type: String,
    unique: true,
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  finalAmount: {
    type: Number,
    required: [true, 'Final amount is required'],
    min: [0, 'Final amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'offline', 'cash'],
    required: [true, 'Payment method is required']
  },
  transactionId: {
    type: String,
    trim: true
  },
  paymentDate: {
    type: Date
  },
  enrollmentStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  
  // Calculate final amount if not provided
  if (this.amount !== undefined && this.discountAmount !== undefined && !this.finalAmount) {
    this.finalAmount = this.amount - this.discountAmount;
  }
  
  next();
});

// Add indexes for better query performance
orderSchema.index({ student: 1 });
orderSchema.index({ course: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ enrollmentStatus: 1 });
orderSchema.index({ createdAt: -1 });
// orderNumber already has unique index from schema definition

module.exports = mongoose.model('Order', orderSchema);
