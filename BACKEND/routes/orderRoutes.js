const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders,
  getArtistOrders
} = require('../controllers/orderController');
const { verifyToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/artist-orders', verifyToken, authorize('artist'), getArtistOrders);

// Admin routes
router.route('/')
  .get(verifyToken, authorize('admin'), getOrders);

router.route('/:id')
  .get(verifyToken, getOrder)
  .put(verifyToken, authorize('admin', 'artist'), updateOrderStatus);

module.exports = router;