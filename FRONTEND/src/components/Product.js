import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/Product.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = useCallback((product) => {
    try {
      // Get the existing cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Check if the product already exists in the cart
      const existingProductIndex = cart.findIndex((item) => item.id === product.id);

      if (existingProductIndex !== -1) {
        // If the product exists, increment its quantity
        cart[existingProductIndex].quantity += 1;
      } else {
        // If the product does not exist, add it to the cart with quantity 1
        cart.push({
          ...product,
          quantity: 1
        });
      }

      // Save the updated cart back to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Trigger storage event for navbar cart count update
      window.dispatchEvent(new Event('storage'));

      // Navigate to cart page
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading products</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="no-products-container">
        <h2>No products available</h2>
        <p>Please check back later for our latest artworks.</p>
      </div>
    );
  }

  return (
    <div className="container1">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card product-card">
              <div className="card-img-wrapper">
                <img
                  src={product.images?.[0] || '/placeholder.jpg'}
                  className="card-img-top"
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text description">{product.description}</p>
                <p className="card-text price">
                  <strong>Price:</strong> ${product.price?.toFixed(2) || '0.00'}
                </p>
                <button
                  onClick={() => handleBuyNow(product)}
                  className="btn btn-primary buy-now-btn"
                  disabled={!product.price}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Product.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.number,
      images: PropTypes.arrayOf(PropTypes.string)
    })
  )
};

export default React.memo(Product);
