import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import api from '../../../services/api';
import { formatPrice, validateQuantity } from './CartController';
import '../../../styles/Cart.css';

const CartItem = React.memo(({ item, onUpdateQuantity, onRemove, updating }) => (
  <tr>
    <td>
      <div className="d-flex align-items-center">
        {item.product.image ? (
          <img 
            src={item.product.image} 
            alt={item.product.name}
            className="cart-item-image me-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.jpg';
            }}
          />
        ) : (
          <div className="cart-item-placeholder me-3">
            <i className="bi bi-image"></i>
          </div>
        )}
        <div>
          <h6 className="mb-0">{item.product.name}</h6>
          <small className="text-muted">{item.product.category}</small>
        </div>
      </div>
    </td>
    <td>{formatPrice(item.product.price)}</td>
    <td>
      <div className="quantity-controls">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
          disabled={updating || item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <i className="bi bi-dash"></i>
        </button>
        <span className="mx-2">{item.quantity}</span>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
          disabled={updating}
          aria-label="Increase quantity"
        >
          <i className="bi bi-plus"></i>
        </button>
      </div>
    </td>
    <td>{formatPrice(item.product.price * item.quantity)}</td>
    <td>
      <button
        className="btn btn-sm btn-danger"
        onClick={() => onRemove(item.product._id)}
        disabled={updating}
        aria-label="Remove item"
      >
        <i className="bi bi-trash"></i>
      </button>
    </td>
  </tr>
));

CartItem.propTypes = {
  item: PropTypes.shape({
    product: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string,
      category: PropTypes.string
    }).isRequired,
    quantity: PropTypes.number.isRequired
  }).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await api.get('/cart');
      setCartItems(response.data.items || []);
      setError(null);
    } catch (error) {
      setError('Failed to fetch cart items. Please try again later.');
      toast.error('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (!validateQuantity(newQuantity)) return;
    
    setUpdating(true);
    try {
      await api.put(`/cart/update/${productId}`, { quantity: newQuantity });
      await fetchCartItems();
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setUpdating(false);
    }
  }, [fetchCartItems]);

  const removeItem = useCallback(async (productId) => {
    setUpdating(true);
    try {
      await api.delete(`/cart/remove/${productId}`);
      await fetchCartItems();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  }, [fetchCartItems]);

  const total = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    [cartItems]
  );

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty');
      return;
    }
    navigate('/checkout');
  }, [cartItems.length, navigate]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-outline-danger ms-3"
            onClick={fetchCartItems}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center empty-cart-container">
          <i className="bi bi-cart-x empty-cart-icon"></i>
          <p className="lead">Your cart is empty</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/product')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.product._id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    updating={updating}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="card mt-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Total: {formatPrice(total)}</h4>
                <div>
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => navigate('/product')}
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleCheckout}
                    disabled={updating}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(Cart);
