const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { validateProductData } = require('../utils/validation');
const { logger } = require('../utils/logger');
const cacheService = require('../utils/cache');
const Product = require('../models/ProductModel');
const productController = require('../controllers/ProductController'); // Ensure this file exists and has 'addProduct'

// Cache configuration
const CACHE_DURATION = 3600; // 1 hour

// Public routes
router.get('/', cacheService.cache({
  duration: CACHE_DURATION,
  prefix: 'products',
  useQueryParams: true
}), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      sort,
      minPrice,
      maxPrice 
    } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category.toLowerCase();
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(':');
      if (['name', 'price', 'createdAt'].includes(field)) {
        sortOptions[field] = order === 'desc' ? -1 : 1;
      }
    } else {
      sortOptions.createdAt = -1; // Default sort by newest
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .limit(Number(limit))
        .skip(skip)
        .select('-__v')
        .lean(),
      Product.countDocuments(query)
    ]);

    logger.info('Products retrieved successfully', {
      page,
      limit,
      total,
      filters: { search, category, minPrice, maxPrice }
    });

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalProducts: total,
      hasMore: skip + products.length < total
    });
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', cacheService.cache({
  duration: CACHE_DURATION,
  prefix: 'product'
}), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('-__v')
      .lean();

    if (!product) {
      logger.warn('Product not found', { productId: req.params.id });
      return res.status(404).json({ message: 'Product not found' });
    }

    logger.info('Product retrieved successfully', { productId: req.params.id });
    res.status(200).json(product);
  } catch (error) {
    logger.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected routes (Admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const validation = validateProductData(req.body);
    if (!validation.isValid) {
      logger.warn('Product validation failed', { errors: validation.errors });
      return res.status(400).json({ errors: validation.errors });
    }

    const product = new Product({
      ...req.body,
      category: req.body.category.toLowerCase()
    });

    await product.save();
    
    // Clear products cache
    await cacheService.clearCache('products:*');
    
    logger.info('Product created successfully', { productId: product._id });
    res.status(201).json(product);
  } catch (error) {
    logger.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/add-product', productController.addProduct); // Ensure 'addProduct' is defined in ProductController.js

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const validation = validateProductData(req.body);
    if (!validation.isValid) {
      logger.warn('Product validation failed', { errors: validation.errors });
      return res.status(400).json({ errors: validation.errors });
    }

    if (req.body.category) {
      req.body.category = req.body.category.toLowerCase();
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!product) {
      logger.warn('Product not found for update', { productId: req.params.id });
      return res.status(404).json({ message: 'Product not found' });
    }

    // Clear related cache
    await Promise.all([
      cacheService.clearCache(`product:${req.params.id}`),
      cacheService.clearCache('products:*')
    ]);

    logger.info('Product updated successfully', { productId: product._id });
    res.status(200).json(product);
  } catch (error) {
    logger.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      logger.warn('Product not found for deletion', { productId: req.params.id });
      return res.status(404).json({ message: 'Product not found' });
    }

    // Clear related cache
    await Promise.all([
      cacheService.clearCache(`product:${req.params.id}`),
      cacheService.clearCache('products:*')
    ]);

    logger.info('Product deleted successfully', { productId: req.params.id });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;