const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials
} = require('../controllers/testimonialController');

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedTestimonials);

// Protected routes
router.get('/', protect, getTestimonials);
router.get('/:id', protect, getTestimonialById);

// Admin only routes
router.post('/', protect, adminOnly, createTestimonial);
router.put('/:id', protect, adminOnly, updateTestimonial);
router.delete('/:id', protect, adminOnly, deleteTestimonial);

module.exports = router;
