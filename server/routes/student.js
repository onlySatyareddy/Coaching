const express = require('express');
const router = express.Router();
const { protect, studentOnly } = require('../middlewares/auth');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Get enrolled courses
router.get('/enrollments', protect, studentOnly, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ 
      student: req.user.id,
      status: 'active'
    })
    .populate('course', 'title thumbnail description syllabus videos materials')
    .populate('course.faculty', 'name qualification image')
    .sort({ enrollmentDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        enrollments
      }
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get enrollments'
    });
  }
});

// Enroll in a course
router.post('/enroll/:courseId', protect, studentOnly, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists and is active
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Check if course is full
    if (course.enrolledStudents >= course.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Course is full'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      payment: {
        status: 'pending',
        amount: course.price
      }
    });

    // Update course enrolled count
    await course.enrollStudent();

    // Update user enrolled courses
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { enrolledCourses: courseId } }
    );

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('course', 'title thumbnail description price');

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: {
        enrollment: populatedEnrollment
      }
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update progress
router.put('/enrollments/:enrollmentId/progress', protect, studentOnly, async (req, res) => {
  try {
    const { completedTopics, completedVideos, completedMaterials } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      student: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update progress
    if (completedTopics) {
      enrollment.progress.completedTopics = [...new Set([...enrollment.progress.completedTopics, ...completedTopics])];
    }
    if (completedVideos) {
      enrollment.progress.completedVideos = [...new Set([...enrollment.progress.completedVideos, ...completedVideos])];
    }
    if (completedMaterials) {
      enrollment.progress.completedMaterials = [...new Set([...enrollment.progress.completedMaterials, ...completedMaterials])];
    }

    // Calculate percentage (simplified calculation)
    const course = await Course.findById(enrollment.course);
    const totalItems = (course.syllabus?.length || 0) + (course.videos?.length || 0) + (course.materials?.length || 0);
    const completedItems = enrollment.progress.completedTopics.length + 
                          enrollment.progress.completedVideos.length + 
                          enrollment.progress.completedMaterials.length;
    
    enrollment.progress.percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        enrollment
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  }
});

// Add notes
router.post('/enrollments/:enrollmentId/notes', protect, studentOnly, async (req, res) => {
  try {
    const { title, content } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: req.params.enrollmentId,
      student: req.user.id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.notes.push({ title, content });
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: {
        note: enrollment.notes[enrollment.notes.length - 1]
      }
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
});

// Get student profile
router.get('/profile', protect, studentOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses', 'title thumbnail price progress');

    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

module.exports = router;
