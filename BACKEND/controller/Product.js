const { Product } = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    next(err); // Pass the error to the custom error handling middleware
  }
};

exports.fetchAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    next(err); // Pass the error to the custom error handling middleware
  }
};

exports.fetchProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err); // Pass the error to the custom error handling middleware
  }
};

exports.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    next(err); // Pass the error to the custom error handling middleware
  }
};