const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updatePaymentStatus,
  getOrdersByStudent,
  getPaymentStats
} = require('../controllers/orderController');

const router = express.Router();

// Protected routes
router.get('/', protect, getOrders);
router.get('/stats', protect, adminOnly, getPaymentStats);
router.get('/student/:studentId', protect, getOrdersByStudent);
router.get('/:id', protect, getOrderById);

// Admin only routes
router.post('/', protect, adminOnly, createOrder);
router.put('/:id', protect, adminOnly, updateOrder);
router.put('/:id/payment-status', protect, adminOnly, updatePaymentStatus);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;
