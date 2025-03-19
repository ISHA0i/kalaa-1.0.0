const { Product } = require('../models/ProductModel');
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const { ValidationError, NotFoundError } = require('../errors/AppError');
const { catchAsync } = require('../errors/servererror');
const cache = require('../utils/cache');

exports.createProduct = catchAsync(async (req, res) => {
  const { description, images, productId, name, price } = req.body;

  // Validation
  const error = new ValidationError('Product validation failed');
  if (!name) error.addError('name', 'Product name is required');
  if (!price) error.addError('price', 'Product price is required');
  if (!description) error.addError('description', 'Product description is required');
  if (!productId) error.addError('productId', 'Product ID is required');
  if (error.validationErrors.length > 0) throw error;

  const product = new Product({ 
    description, 
    images, 
    productId, 
    name, 
    price,
    createdAt: new Date()
  });

  const savedProduct = await product.save();
  
  // Clear products cache
  await cache.del('products:all');
  
  logger.info('Product created', { 
    productId: savedProduct._id, 
    name: savedProduct.name 
  });

  res.status(201).json({
    status: 'success',
    data: savedProduct
  });
});

exports.fetchAllProducts = catchAsync(async (req, res) => {
  // Try to get from cache first
  const cachedProducts = await cache.get('products:all');
  if (cachedProducts) {
    return res.status(200).json({
      status: 'success',
      data: JSON.parse(cachedProducts),
      source: 'cache'
    });
  }

  // Query parameters for filtering and pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: 'i' };
  }
  if (req.query.minPrice) {
    query.price = { $gte: parseFloat(req.query.minPrice) };
  }
  if (req.query.maxPrice) {
    query.price = { ...query.price, $lte: parseFloat(req.query.maxPrice) };
  }

  // Execute query with pagination
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  // Cache results for 5 minutes
  await cache.set('products:all', JSON.stringify(products), 'EX', 300);

  logger.info('Products fetched', { 
    count: products.length,
    page,
    limit
  });

  res.status(200).json({
    status: 'success',
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    source: 'database'
  });
});

exports.fetchProductById = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid product ID format');
  }

  // Try to get from cache first
  const cachedProduct = await cache.get(`product:${id}`);
  if (cachedProduct) {
    return res.status(200).json({
      status: 'success',
      data: JSON.parse(cachedProduct),
      source: 'cache'
    });
  }

  const product = await Product.findById(id);
  
  if (!product) {
    throw new NotFoundError('Product');
  }

  // Cache product for 5 minutes
  await cache.set(`product:${id}`, JSON.stringify(product), 'EX', 300);

  logger.info('Product fetched', { productId: id });

  res.status(200).json({
    status: 'success',
    data: product,
    source: 'database'
  });
});

exports.updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid product ID format');
  }

  // Validation
  const error = new ValidationError('Product update validation failed');
  if (updateData.name === '') error.addError('name', 'Product name cannot be empty');
  if (updateData.price && updateData.price < 0) error.addError('price', 'Price cannot be negative');
  if (error.validationErrors.length > 0) throw error;

  const product = await Product.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new NotFoundError('Product');
  }

  // Clear caches
  await Promise.all([
    cache.del(`product:${id}`),
    cache.del('products:all')
  ]);

  logger.info('Product updated', { 
    productId: id,
    updates: Object.keys(updateData)
  });

  res.status(200).json({
    status: 'success',
    data: product
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid product ID format');
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new NotFoundError('Product');
  }

  // Clear caches
  await Promise.all([
    cache.del(`product:${id}`),
    cache.del('products:all')
  ]);

  logger.info('Product deleted', { productId: id });

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully'
  });
});

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    logger.info('Product added successfully', { productId: product._id });
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    logger.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



