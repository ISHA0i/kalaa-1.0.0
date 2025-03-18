const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true
  },
  items: [cartItemSchema],
  status: {
    type: String,
    enum: ['active', 'checkout', 'abandoned'],
    default: 'active'
  },
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
cartSchema.index({ userId: 1, status: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware to update totals
cartSchema.pre('save', async function(next) {
  try {
    if (this.isModified('items')) {
      let totalItems = 0;
      let totalAmount = 0;

      for (const item of this.items) {
        totalItems += item.quantity;
        totalAmount += item.price * item.quantity;
      }

      this.totalItems = totalItems;
      this.totalAmount = Number(totalAmount.toFixed(2));
      this.lastActivity = new Date();
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Methods
cartSchema.methods.addItem = async function(productId, quantity, price) {
  const existingItem = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = price;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price
    });
  }

  return this.save();
};

cartSchema.methods.updateItemQuantity = async function(productId, quantity) {
  const item = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    this.items = this.items.filter(
      item => item.product.toString() !== productId.toString()
    );
  } else {
    item.quantity = quantity;
  }

  return this.save();
};

cartSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  return this.save();
};

cartSchema.methods.clearCart = async function() {
  this.items = [];
  return this.save();
};

cartSchema.methods.abandon = async function() {
  this.status = 'abandoned';
  return this.save();
};

cartSchema.methods.checkout = async function() {
  this.status = 'checkout';
  return this.save();
};

// Statics
cartSchema.statics.getActiveCart = async function(userId) {
  let cart = await this.findOne({
    userId,
    status: 'active'
  }).populate('items.product');

  if (!cart) {
    cart = new this({
      userId,
      items: []
    });
    await cart.save();
  }

  return cart;
};

cartSchema.statics.cleanupAbandonedCarts = async function() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  return this.updateMany(
    {
      status: 'active',
      lastActivity: { $lt: thirtyMinutesAgo }
    },
    {
      $set: { status: 'abandoned' }
    }
  );
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart; 