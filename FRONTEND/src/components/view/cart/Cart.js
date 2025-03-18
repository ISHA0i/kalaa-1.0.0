import React, { useEffect, useState } from 'react';
import '../../../styles/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cart); // Debug: Check if `price` exists in the cart data
    const updatedCart = cart.map((item) => ({ ...item, quantity: item.quantity || 1 }));
    setCartItems(updatedCart);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += delta;

    if (updatedCart[index].quantity < 1) {
      updatedCart[index].quantity = 1;
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleDelete = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.images[0]} alt={item.name} />
              <div className="cart-item-details">
                <h5>{item.name}</h5>
                <p>{item.description}</p>
                <p><strong>Price:</strong> ${item.price ? item.price.toFixed(2) : '0.00'}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Total Price:</strong> ${(item.price * item.quantity).toFixed(2)}</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(index, -1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(index, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(index)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
          <div className="cart-total">
            <p><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
