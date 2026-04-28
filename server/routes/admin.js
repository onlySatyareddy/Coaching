const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Inquiry = require('../models/Inquiry');
const Blog = require('../models/Blog');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalStudents,
      totalCourses,
      totalFaculty,
      totalInquiries,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      Course.countDocuments({ isActive: true }),
      Faculty.countDocuments({ isActive: true }),
      Inquiry.countDocuments(),
      // For revenue, we'll count total course prices (placeholder)
      Course.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ])
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalCourses,
          totalFaculty,
          totalInquiries,
          totalRevenue: revenue
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
});

router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalFaculty,
      totalInquiries,
      pendingInquiries,
      recentUsers,
      recentInquiries
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Course.countDocuments({ isActive: true }),
      Faculty.countDocuments({ isActive: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'pending' }),
      User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5),
      Inquiry.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          users: totalUsers,
          courses: totalCourses,
          faculty: totalFaculty,
          inquiries: totalInquiries,
          pendingInquiries
        },
        recentUsers,
        recentInquiries
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    if (role) query.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

// Update user status
router.put('/users/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Get all inquiries
router.get('/inquiries', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const inquiries = await Inquiry.find(query)
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        inquiries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inquiries'
    });
  }
});

// Update inquiry status
router.put('/inquiries/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, response, assignedTo } = req.body;
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status,
        response: response ? {
          ...response,
          respondedBy: req.user.id,
          respondedAt: new Date()
        } : undefined,
        assignedTo
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry'
    });
  }
});

// Blog management
router.get('/blogs', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blogs'
    });
  }
});

// Create blog
router.post('/blogs', protect, adminOnly, async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user.id
    };

    const blog = await Blog.create(blogData);
    await blog.populate('author', 'name');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog }
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog'
    });
  }
});

// Update blog
router.put('/blogs/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog }
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog'
    });
  }
});

// Delete blog
router.delete('/blogs/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog'
    });
  }
});

// Course management
router.get('/courses', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find(query)
      .populate('faculty', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get courses'
    });
  }
});

// Create course
router.post('/courses', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    await course.populate('faculty', 'name email');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course'
    });
  }
});

// Update course
router.put('/courses/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('faculty', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course'
    });
  }
});

// Delete course
router.delete('/courses/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course'
    });
  }
});

// Faculty management
router.get('/faculty', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const faculty = await Faculty.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Faculty.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        faculty,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get faculty'
    });
  }
});

// Create faculty
router.post('/faculty', protect, adminOnly, async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: { faculty }
    });
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create faculty'
    });
  }
});

// Update faculty
router.put('/faculty/:id', protect, adminOnly, async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faculty updated successfully',
      data: { faculty }
    });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update faculty'
    });
  }
});

// Delete faculty
router.delete('/faculty/:id', protect, adminOnly, async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faculty deleted successfully'
    });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete faculty'
    });
  }
});

// Results/Toppers management
router.get('/results', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, exam } = req.query;
    
    const query = {};
    if (exam) query.exam = exam;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // For now, return enrolled students with their progress
    const Enrollment = require('../models/Enrollment');
    const results = await Enrollment.find(query)
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Enrollment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get results'
    });
  }
});

// Add topper/result
router.post('/results', protect, adminOnly, async (req, res) => {
  try {
    const { student, course, exam, score, rank, image } = req.body;
    
    // Create a result entry (you might want to create a separate Result model)
    const Enrollment = require('../models/Enrollment');
    const enrollment = await Enrollment.findOneAndUpdate(
      { student, course },
      { 
        $push: { 
          results: { exam, score, rank, image, date: new Date() }
        }
      },
      { new: true, upsert: true }
    ).populate('student', 'name email').populate('course', 'title');

    res.status(201).json({
      success: true,
      message: 'Result added successfully',
      data: { enrollment }
    });
  } catch (error) {
    console.error('Add result error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add result'
    });
  }
});

// Payments/Orders management
router.get('/payments', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // For now, return enrollments as payments
    const Enrollment = require('../models/Enrollment');
    const payments = await Enrollment.find(query)
      .populate('student', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Enrollment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments'
    });
  }
});

// Update payment status
router.put('/payments/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    const Enrollment = require('../models/Enrollment');
    const payment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus: status,
        paidAt: status === 'completed' ? new Date() : null
      },
      { new: true }
    ).populate('student', 'name email').populate('course', 'title price');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: { payment }
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
});

// Testimonials management
router.get('/testimonials', protect, adminOnly, async (req, res) => {
  try {
    const Testimonial = require('../models/Testimonial');
    const { page = 1, limit = 10, featured } = req.query;
    
    const query = {};
    if (featured === 'true') query.featured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Testimonial.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        testimonials,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get testimonials'
    });
  }
});

router.post('/testimonials', protect, adminOnly, async (req, res) => {
  try {
    const Testimonial = require('../models/Testimonial');
    const testimonial = await Testimonial.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: { testimonial }
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Batches management
router.get('/batches', protect, adminOnly, async (req, res) => {
  try {
    const Batch = require('../models/Batch');
    const { page = 1, limit = 10, course, status } = req.query;
    
    const query = {};
    if (course) query.course = course;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const batches = await Batch.find(query)
      .populate('course', 'title')
      .populate('faculty', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Batch.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        batches,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get batches'
    });
  }
});

router.post('/batches', protect, adminOnly, async (req, res) => {
  try {
    const Batch = require('../models/Batch');
    const batch = await Batch.create(req.body);

    const populatedBatch = await Batch.findById(batch._id)
      .populate('course', 'title')
      .populate('faculty', 'name');

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: { batch: populatedBatch }
    });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create batch',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Orders management
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const Order = require('../models/Order');
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    
    const query = {};
    if (status) query.enrollmentStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find(query)
      .populate('student', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
    });
  }
});

router.post('/orders', protect, adminOnly, async (req, res) => {
  try {
    const Order = require('../models/Order');
    const order = await Order.create(req.body);

    const populatedOrder = await Order.findById(order._id)
      .populate('student', 'name email')
      .populate('course', 'title price');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: populatedOrder }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
