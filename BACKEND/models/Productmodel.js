const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters long'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return v.toString().match(/^\d+(\.\d{1,2})?$/);
      },
      message: 'Price must have at most 2 decimal places'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    lowercase: true,
    enum: {
      values: ['electronics', 'clothing', 'books', 'home', 'other'],
      message: '{VALUE} is not a valid category'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be a whole number'
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail image is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch'],
      default: 'cm'
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lb'],
      default: 'kg'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }
  
  const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
  this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  this.numReviews = this.ratings.length;
};

// Add rating
productSchema.methods.addRating = async function(userId, rating, review) {
  const existingRatingIndex = this.ratings.findIndex(
    r => r.user.toString() === userId.toString()
  );

  if (existingRatingIndex >= 0) {
    this.ratings[existingRatingIndex] = { user: userId, rating, review };
  } else {
    this.ratings.push({ user: userId, rating, review });
  }

  this.calculateAverageRating();
  await this.save();
};

// Check stock availability
productSchema.methods.checkStock = function(quantity) {
  return this.stock >= quantity;
};

// Update stock
productSchema.methods.updateStock = async function(quantity) {
  if (this.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  this.stock -= quantity;
  return this.save();
};

// Virtual for URL
productSchema.virtual('url').get(function() {
  return `/products/${this._id}`;
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;