import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import '../../../styles/Page.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, retryCount]);

  const handleAddToCart = useCallback(async (productId) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      toast.success('Item added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add item to cart. Please try again.');
    }
  }, []);

  // Dummy products for development
  const dummyProducts = [
    {
      _id: '1',
      name: 'Traditional Madhubani Painting',
      description: 'Beautiful handmade Madhubani painting depicting rural life',
      price: 15000,
      imageUrl: '/images/products/madhubani.jpg'
    },
    {
      _id: '2',
      name: 'Contemporary Abstract Art',
      description: 'Modern abstract painting with vibrant colors',
      price: 25000,
      imageUrl: '/images/products/abstract.jpg'
    },
    {
      _id: '3',
      name: 'Rajasthani Miniature Art',
      description: 'Intricate miniature painting in traditional Rajasthani style',
      price: 18000,
      imageUrl: '/images/products/miniature.jpg'
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <h2>Error</h2>
        <p className="text-danger">{error}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setRetryCount(0);
            fetchProducts();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Use dummy products if no products are fetched
  const displayProducts = products.length > 0 ? products : dummyProducts;

  return (
    <div className="products-container">
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Our Products</h1>
          <p className="lead mb-4">
            Discover unique artworks from talented artists around the world
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {displayProducts.map((product) => (
              <div key={product._id} className="col-md-4 mb-4">
                <div className="card h-100 border-0 shadow-sm product-card">
                  <div className="card-img-wrapper">
                    <img
                      src={product.imageUrl}
                      className="card-img-top"
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title h5">{product.name}</h3>
                    <p className="card-text text-muted">{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="h5 mb-0">₹{product.price.toLocaleString('en-IN')}</span>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(product._id)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product; 