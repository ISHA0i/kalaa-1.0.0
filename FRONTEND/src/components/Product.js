import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        console.log('Fetched products:', data); // Debug log
        setProducts(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

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
                <Link to={`/product/${product.id}`} className="btn btn-primary">
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
