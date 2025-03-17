// filepath: d:\git clone\kalaa-1.0.0\BACKEND\routes\ProductRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/ProductControll');
const { Product } = require('../models/ProductModel');
const mongoose = require('mongoose');

// Create a new product
router.post('/', createProduct);

// Get all products
router.get('/', fetchAllProducts);

// Get product by ID
router.get('/products/:id', fetchProductById);

// Update product by ID
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product by ID
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;