const express = require('express');
const {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCart
} = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All cart routes are protected
router.use(verifyToken);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.route('/items')
  .post(addItemToCart);

router.route('/items/:productId')
  .put(updateCartItemQuantity)
  .delete(removeItemFromCart);

module.exports = router;