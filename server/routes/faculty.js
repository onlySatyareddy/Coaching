const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { createFacultySchema } = require('../middlewares/validation');
const {
  getFaculty,
  getFacultyMember,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFeaturedFaculty
} = require('../controllers/facultyController');

// Public routes
router.get('/', getFaculty);
router.get('/featured', getFeaturedFaculty);
router.get('/:id', getFacultyMember);

// Admin routes
router.post('/', protect, validate(createFacultySchema), createFaculty);
router.put('/:id', protect, updateFaculty);
router.delete('/:id', protect, deleteFaculty);

module.exports = router;
