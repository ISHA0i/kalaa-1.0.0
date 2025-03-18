import React, { useEffect, useState } from 'react';
import '../styles/Product.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Debug: Check if `price` exists in the response
        setProducts(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
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
        quantity: 1, // Add a default quantity of 1
      });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Optionally, redirect to the cart page
    window.location.href = '/Cart';
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container1">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card">
              <img
                src={product.images && product.images[0] ? product.images[0] : 'placeholder.jpg'}
                className="card-photoo-top"
                alt={product.name}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text"><strong>Price:</strong> ${product.price ? product.price.toFixed(2) : '0.00'}</p> {/* Ensure price is displayed */}
                <button
                  onClick={() => handleBuyNow(product)}
                  className="btn btn-primary"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
