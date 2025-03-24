const User = require('../models/UserModel');
const Product = require('../models/ProductModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price images stock'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate cart totals
    let totalItems = 0;
    let subtotal = 0;

    user.cart.forEach(item => {
      if (item.product) {
        totalItems += item.quantity;
        subtotal += item.quantity * item.product.price;
      }
    });

    // Filter out any items where the product is no longer available
    const validCart = user.cart.filter(item => item.product !== null);

    res.status(200).json({
      success: true,
      data: {
        items: validCart,
        totalItems,
        subtotal
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch cart',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate inputs
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock. Only ${product.stock} available.`
      });
    }

    // Find user and update cart
    const user = await User.findById(req.user.id);

    // Check if product already in cart
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Update quantity if product already in cart
      user.cart[cartItemIndex].quantity += quantity;
      
      // Check if new quantity exceeds stock
      if (user.cart[cartItemIndex].quantity > product.stock) {
        user.cart[cartItemIndex].quantity = product.stock;
      }
    } else {
      // Add new product to cart
      user.cart.push({
        product: productId,
        quantity
      });
    }

    await user.save();

    // Fetch updated cart with product details
    const updatedUser = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price images stock'
    });

    // Calculate cart totals
    let totalItems = 0;
    let subtotal = 0;

    updatedUser.cart.forEach(item => {
      if (item.product) {
        totalItems += item.quantity;
        subtotal += item.quantity * item.product.price;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: {
        items: updatedUser.cart,
        totalItems,
        subtotal
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not add item to cart',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    // Validate inputs
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock. Only ${product.stock} available.`
      });
    }

    // Find user
    const user = await User.findById(req.user.id);

    // Find item in cart
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update quantity
    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    // Fetch updated cart with product details
    const updatedUser = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price images stock'
    });

    // Calculate cart totals
    let totalItems = 0;
    let subtotal = 0;

    updatedUser.cart.forEach(item => {
      if (item.product) {
        totalItems += item.quantity;
        subtotal += item.quantity * item.product.price;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: {
        items: updatedUser.cart,
        totalItems,
        subtotal
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not update cart item',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
exports.removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user
    const user = await User.findById(req.user.id);

    // Remove item from cart
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    await user.save();

    // Fetch updated cart with product details
    const updatedUser = await User.findById(req.user.id).populate({
      path: 'cart.product',
      select: 'name price images stock'
    });

    // Calculate cart totals
    let totalItems = 0;
    let subtotal = 0;

    updatedUser.cart.forEach(item => {
      if (item.product) {
        totalItems += item.quantity;
        subtotal += item.quantity * item.product.price;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: {
        items: updatedUser.cart,
        totalItems,
        subtotal
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not remove item from cart',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Find user and clear cart
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: {
        items: [],
        totalItems: 0,
        subtotal: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not clear cart',
      error: error.message
    });
  }
}; 