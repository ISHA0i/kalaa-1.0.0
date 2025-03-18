const { Product } = require('../models/ProductModel');
const mongoose = require('mongoose');

exports.createProduct = async (req, res, next) => {
  const { description, images, productId, name, price } = req.body; // Include price
  const product = new Product({ description, images, productId, name, price }); // Add price to the product object
  try {
    const doc = await product.save();
    res.status(201).json(doc); // Return the saved product
  } catch (err) {
    next(err); // Pass the error to the custom error handling middleware
  }
};

exports.fetchAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find(); // Fetch all products
    console.log(products); // Debug: Check if `price` exists in the database
    res.status(200).json(products); // Return the products
  } catch (err) {
    next(err); // Pass the error to the custom error handling middleware
  }
};

exports.fetchProductById = async (req, res, next) => {
  const { id } = req.params;

  console.log(`Fetching product with ID: ${id}`); // Debugging log

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error('Invalid product ID format'); // Debugging log
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findById(id);
    console.log('Database query result:', product); // Debugging log

    if (!product) {
      console.error('Product not found'); // Debugging log
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err.message); // Debugging log
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
    res.status(200).json(product);
  } catch (err) {
    next(err); // Pass the error to the custom error handling middleware
  }
};


