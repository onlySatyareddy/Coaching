const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { createCourseSchema } = require('../middlewares/validation');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addReview,
  getFeaturedCourses
} = require('../controllers/courseController');

// Public routes
router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:id', getCourse);

// Protected routes
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.post('/', protect, validate(createCourseSchema), createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

module.exports = router;
