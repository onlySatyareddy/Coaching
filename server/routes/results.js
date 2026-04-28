const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const {
  getResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
  getFeaturedResults,
  getResultsByStudent
} = require('../controllers/resultController');

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedResults);

// Protected routes
router.get('/', protect, getResults);
router.get('/student/:studentId', protect, getResultsByStudent);
router.get('/:id', protect, getResultById);

// Admin only routes
router.post('/', protect, adminOnly, createResult);
router.put('/:id', protect, adminOnly, updateResult);
router.delete('/:id', protect, adminOnly, deleteResult);

module.exports = router;
