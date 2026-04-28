const Order = require('../models/Order');

// Get all orders
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, student, course, paymentStatus, enrollmentStatus } = req.query;
    
    const query = {};
    if (student) query.student = student;
    if (course) query.course = course;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (enrollmentStatus) query.enrollmentStatus = enrollmentStatus;

    const orders = await Order.find(query)
      .populate('student', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('student', 'name email phone')
      .populate('course', 'title description price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    
    // Populate the order for response
    await order.populate('student', 'name email');
    await order.populate('course', 'title price');
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('student', 'name email')
     .populate('course', 'title price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId, paymentDate } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus, 
        transactionId, 
        paymentDate: paymentDate || new Date(),
        enrollmentStatus: paymentStatus === 'completed' ? 'confirmed' : 'pending'
      },
      { new: true, runValidators: true }
    ).populate('student', 'name email')
     .populate('course', 'title price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get orders by student
const getOrdersByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    const orders = await Order.find({ student: studentId })
      .populate('course', 'title description price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get orders by student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student orders'
    });
  }
};

// Get payment statistics
const getPaymentStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$finalAmount' }
        }
      }
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        stats,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      }
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics'
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updatePaymentStatus,
  getOrdersByStudent,
  getPaymentStats
};
