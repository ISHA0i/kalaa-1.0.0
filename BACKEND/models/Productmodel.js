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
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
  }]
});

// Create index for faster queries
productSchema.index({ name: 'text', description: 'text', category: 'text' });

// Virtual for URL
productSchema.virtual('url').get(function() {
  return `/products/${this._id}`;
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product; 