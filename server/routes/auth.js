const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../middlewares/validation');
const {
  register,
  login,
  refreshToken,
  logout,
  getMe
} = require('../controllers/authController');

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
