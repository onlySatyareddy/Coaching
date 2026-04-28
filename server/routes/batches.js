const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatchesByCourse,
  getAvailableBatches,
  updateBatchStudentCount
} = require('../controllers/batchController');

const router = express.Router();

// Public routes
router.get('/available', getAvailableBatches);

// Protected routes
router.get('/', protect, getBatches);
router.get('/course/:courseId', protect, getBatchesByCourse);
router.get('/:id', protect, getBatchById);

// Admin only routes
router.post('/', protect, adminOnly, createBatch);
router.put('/:id', protect, adminOnly, updateBatch);
router.put('/:id/student-count', protect, adminOnly, updateBatchStudentCount);
router.delete('/:id', protect, adminOnly, deleteBatch);

module.exports = router;
