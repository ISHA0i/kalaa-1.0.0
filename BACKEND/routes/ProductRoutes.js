const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  addProductRating
} = require('../controllers/productController');
const { verifyToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', verifyToken, authorize('artist', 'admin'), createProduct);
router.put('/:id', verifyToken, authorize('artist', 'admin'), updateProduct);
router.delete('/:id', verifyToken, authorize('artist', 'admin'), deleteProduct);
router.post('/:id/ratings', verifyToken, addProductRating);

module.exports = router;