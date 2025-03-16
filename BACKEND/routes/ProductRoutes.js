// filepath: d:\git clone\kalaa-1.0.0\BACKEND\routes\ProductRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/ProductControll');

// Create a new product
router.post('/', createProduct);

// Get all products
router.get('/', fetchAllProducts);

// Get product by ID
router.get('/products/:id', fetchProductById);

// Update product by ID
router.put('/products/:id', updateProduct);

module.exports = router;