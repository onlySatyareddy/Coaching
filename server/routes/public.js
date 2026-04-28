const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { validate } = require('../middlewares/validation');
const { createInquirySchema } = require('../middlewares/validation');

// Public inquiry submission
router.post('/inquiry', validate(createInquirySchema), async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will contact you soon!',
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get public stats
router.get('/stats', async (req, res) => {
  try {
    const Course = require('../models/Course');
    const Faculty = require('../models/Faculty');
    const User = require('../models/User');

    const [coursesCount, facultyCount, studentsCount] = await Promise.all([
      Course.countDocuments({ isActive: true }),
      Faculty.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student', isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          courses: coursesCount,
          faculty: facultyCount,
          students: studentsCount
        }
      }
    });
  } catch (error) {
    console.error('Get public stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stats'
    });
  }
});

module.exports = router;
