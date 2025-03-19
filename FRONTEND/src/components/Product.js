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
      setError(null); // Reset error state
      const response = await fetch('http://localhost:5001/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);

      // Fallback: Manually set an array of products
      setProducts([
        {
          id: '1',
          name: 'Handmade Painting',
          description: 'A beautiful handmade painting that adds elegance to any space.',
          price: 49.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6czBCdEXZnTFS5lhsUpGKrnjD53ajML6BrQ&s']
        },
        {
          id: '2',
          name: 'Digital Artwork',
          description: 'A stunning piece of digital artwork that showcases creativity.',
          price: 29.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqIKJvid0P8UOaiJrFNqbvEXxq66621HA-DA&s']
        },
        {
          id: '3',
          name: 'Handmade Bracelet',
          description: 'A handcrafted bracelet made with love and precision.',
          price: 19.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSYbl7AxTtyDXnF1uCRx8A_L7PZcQNdYYiJQ&s']
        },
        {
          id: '4',
          name: 'Dreamcatcher',
          description: 'A beautiful dreamcatcher to bring positivity and good vibes.',
          price: 24.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeYmLb3t0hAkIItS-MUt500jweaP_ZKlZjPw&s']
        },
        {
          id: '5',
          name: 'Origami Artwork',
          description: 'A unique origami artwork that reflects intricate craftsmanship.',
          price: 34.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPMH-Zj9L1ZbXJW4fEri5qlOhzTFL0rbMRQw&s']
        },
        {
          id: '6',
          name: 'Digital Artwork',
          description: 'Handmade Clothing',
          price: 29.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE5u2ilyL0qseiqyN8SHHwSoAgB4wZVKCk0w&s']
        },
        {
          id: '7',
          name: 'Sculpture',
          description: 'An elegant sculpture that adds sophistication to your home decor.',
          price: 99.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcxANkTJxu07KiU2s5vsh70Jl-u7uJrdvoyA&s']
        },
        {
          id: '8',
          name: 'Canvas Art',
          description: 'A vibrant canvas art piece that brings life to any room.',
          price: 39.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrSk1zmlCxtBvdI1UL1jV4u81CQaGdDYJgpg&s']
        },
        {
          id: '9',
          name: 'Wooden Carving',
          description: 'A detailed wooden carving that showcases traditional craftsmanship.',
          price: 79.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIZ85WXyp3aXmqIjvoUKBIzjNxoigczmupGw&s']
        },
        {
          id: '10',
          name: 'Ceramic Vase',
          description: 'A beautifully designed ceramic vase perfect for floral arrangements.',
          price: 44.99,
          images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzljPTf1l85wGxJx_8O2GIqAsdF5owB0aSpw&s']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = useCallback(
    (product) => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex((item) => item.id === product.id);

        if (existingProductIndex !== -1) {
          cart[existingProductIndex].quantity += 1;
        } else {
          cart.push({
            ...product,
            quantity: 1
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        navigate('/cart');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      }
    },
    [navigate]
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error && !products.length) {
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
