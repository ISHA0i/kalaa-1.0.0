const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const { body, validationResult } = require('express-validator');

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.product', '-__v')
      .lean();

    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }

    // Calculate total and check product availability
    let total = 0;
    const updatedItems = [];
    let needsUpdate = false;

    for (const item of cart.items) {
      if (item.product) {
        // Check if product is still available and has sufficient stock
        if (item.product.stock < item.quantity) {
          item.quantity = item.product.stock;
          needsUpdate = true;
        }
        total += item.product.price * item.quantity;
        updatedItems.push(item);
      } else {
        needsUpdate = true;
      }
    }

    // Update cart if needed
    if (needsUpdate) {
      await Cart.findByIdAndUpdate(cart._id, { 
        items: updatedItems,
        updatedAt: new Date()
      });
    }

    logger.info('Cart retrieved successfully', { 
      userId: req.user.id,
      itemCount: updatedItems.length,
      total
    });

    res.status(200).json({
      items: updatedItems,
      total: Number(total.toFixed(2)),
      itemCount: updatedItems.length
    });
  } catch (error) {
    logger.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add item to cart
router.post('/add',
  verifyToken,
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Cart add validation failed', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
      }

      const { productId, quantity } = req.body;

      // Check if product exists and has sufficient stock
      const product = await Product.findById(productId);
      if (!product) {
        logger.warn('Product not found for cart addition', { productId });
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.stock < quantity) {
        logger.warn('Insufficient stock for cart addition', { 
          productId,
          requested: quantity,
          available: product.stock
        });
        return res.status(400).json({ 
          message: `Only ${product.stock} items available`
        });
      }

      let cart = await Cart.findOne({ userId: req.user.id });

      if (!cart) {
        cart = new Cart({
          userId: req.user.id,
          items: [{ product: productId, quantity }]
        });
      } else {
        const itemIndex = cart.items.findIndex(item => 
          item.product.toString() === productId
        );

        if (itemIndex > -1) {
          const newQuantity = cart.items[itemIndex].quantity + quantity;
          if (newQuantity > product.stock) {
            return res.status(400).json({ 
              message: `Cannot add ${quantity} more items. Only ${product.stock - cart.items[itemIndex].quantity} more available`
            });
          }
          cart.items[itemIndex].quantity = newQuantity;
        } else {
          cart.items.push({ product: productId, quantity });
        }
      }

      cart.updatedAt = new Date();
      await cart.save();
      await cart.populate('items.product', '-__v');

      logger.info('Item added to cart successfully', {
        userId: req.user.id,
        productId,
        quantity
      });

      res.status(200).json(cart);
    } catch (error) {
      logger.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Update cart item quantity
router.put('/update/:productId',
  verifyToken,
  [
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Cart update validation failed', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
      }

      const { productId } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findOne({ userId: req.user.id });

      if (!cart) {
        logger.warn('Cart not found for update', { userId: req.user.id });
        return res.status(404).json({ message: 'Cart not found' });
      }

      const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId
      );

      if (itemIndex === -1) {
        logger.warn('Item not found in cart', { productId });
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      if (quantity > 0) {
        // Check product stock
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product no longer available' });
        }

        if (quantity > product.stock) {
          return res.status(400).json({ 
            message: `Only ${product.stock} items available`
          });
        }

        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.splice(itemIndex, 1);
      }

      cart.updatedAt = new Date();
      await cart.save();
      await cart.populate('items.product', '-__v');

      logger.info('Cart item updated successfully', {
        userId: req.user.id,
        productId,
        quantity
      });

      res.status(200).json(cart);
    } catch (error) {
      logger.error('Error updating cart:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Remove item from cart
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      logger.warn('Cart not found for item removal', { userId: req.user.id });
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );

    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.product', '-__v');

    logger.info('Item removed from cart successfully', {
      userId: req.user.id,
      productId
    });

    res.status(200).json(cart);
  } catch (error) {
    logger.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Clear cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      logger.warn('Cart not found for clearing', { userId: req.user.id });
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();

    logger.info('Cart cleared successfully', { userId: req.user.id });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    logger.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

logger.info('New user registered', { userId: user._id, email });
logger.error('Error registering user:', error);