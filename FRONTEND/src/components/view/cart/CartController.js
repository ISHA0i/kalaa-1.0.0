import api from '../../../services/api';
import { toast } from 'react-toastify';

const MAX_QUANTITY = 99;
const MIN_QUANTITY = 1;

class CartError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'CartError';
    this.code = code;
  }
}

export const fetchCartItems = async (setCartItems, setSuggestedProducts, navigate) => {
  const token = localStorage.getItem('token');

  try {
    // Check if the backend is reachable
    const healthCheckResponse = await api.get('/health');
    if (!healthCheckResponse.data || healthCheckResponse.status !== 200) {
      throw new Error('Backend is unavailable');
    }

    // If backend is reachable, enforce login
    if (!token) {
      toast.error('Please log in to access your cart');
      navigate('/signin');
      return;
    }

    // Fetch cart items from the backend
    const response = await api.get('/cart');
    if (!response.data) throw new Error('Invalid response from server');

    const updatedCart = response.data.items?.map(item => ({
      ...item,
      quantity: item.quantity > 0 ? item.quantity : 1
    })) || [];

    setCartItems(updatedCart);
  } catch (error) {
    console.error('Error fetching cart items:', error);

    // Fallback: Allow viewing cart without login if backend is unavailable
    if (!token) {
      toast.warn('Backend is unavailable. Viewing fallback cart items.');
    }

    const fallbackCartItems = [
      {
        product: {
          _id: '1',
          name: 'Handmade Painting',
          price: 49.99,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6czBCdEXZnTFS5lhsUpGKrnjD53ajML6BrQ&s',
          category: 'Art'
        },
        quantity: 2
      },
      {
        product: {
          _id: '2',
          name: 'Digital Artwork',
          price: 29.99,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqIKJvid0P8UOaiJrFNqbvEXxq66621HA-DA&s',
          category: 'Digital'
        },
        quantity: 1
      },
      {
        product: {
          _id: '3',
          name: 'Sculpture',
          price: 99.99,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcxANkTJxu07KiU2s5vsh70Jl-u7uJrdvoyA&s',
          category: 'Decor'
        },
        quantity: 1
      }
    ];

    setCartItems(fallbackCartItems);
  }
};

export const fetchSuggestedProducts = async (cart, setSuggestedProducts) => {
  try {
    const response = await api.get('/products');
    if (!response.data) throw new CartError('Invalid response from server', 'INVALID_RESPONSE');

    const cartProductIds = new Set(cart.map(item => item.product?._id));
    const filteredProducts = response.data.filter(product => 
      product._id && !cartProductIds.has(product._id)
    );

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const selectedProducts = shuffleArray(filteredProducts).slice(0, 4);
    setSuggestedProducts(selectedProducts);
  } catch (error) {
    console.error('Error fetching suggested products:', error);
    toast.error('Failed to load suggested products');
    throw error;
  }
};

export const handleQuantityChange = (cartItems, index, delta, setCartItems) => {
  const updatedCart = [...cartItems];
  const newQuantity = updatedCart[index].quantity + delta;

  if (!validateQuantity(newQuantity)) {
    return;
  }

  updatedCart[index].quantity = newQuantity;
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  setCartItems(updatedCart);
};

export const handleDelete = (cartItems, index, setCartItems, fetchSuggestedProducts) => {
  const updatedCart = [...cartItems];
  updatedCart.splice(index, 1);

  localStorage.setItem('cart', JSON.stringify(updatedCart));
  setCartItems(updatedCart);

  fetchSuggestedProducts(updatedCart, setCartItems);
};

export const handleBuyNow = (product, setCartItems) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProductIndex = cart.findIndex((item) => item.product?._id === product._id);

  if (existingProductIndex !== -1) {
    const newQuantity = cart[existingProductIndex].quantity + 1;
    if (validateQuantity(newQuantity)) {
      cart[existingProductIndex].quantity = newQuantity;
    }
  } else {
    cart.push({
      product,
      quantity: 1,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  setCartItems(cart);
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    if (!validateQuantity(quantity)) {
      throw new CartError('Invalid quantity', 'INVALID_QUANTITY');
    }

    const response = await api.post('/cart/add', { productId, quantity });
    if (!response.data) throw new CartError('Invalid response from server', 'INVALID_RESPONSE');

    toast.success('Product added to cart');
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error(error.message || 'Failed to add product to cart');
    throw error;
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    if (!validateQuantity(quantity)) {
      throw new CartError('Invalid quantity', 'INVALID_QUANTITY');
    }

    const response = await api.put(`/cart/update/${productId}`, { quantity });
    if (!response.data) throw new CartError('Invalid response from server', 'INVALID_RESPONSE');

    toast.success('Cart updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    toast.error(error.message || 'Failed to update cart');
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}`);
    if (!response.data) throw new CartError('Invalid response from server', 'INVALID_RESPONSE');

    toast.success('Item removed from cart');
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    toast.error(error.message || 'Failed to remove item');
    throw error;
  }
};

export const getCartItems = async () => {
  try {
    const response = await api.get('/cart');
    if (!response.data) throw new CartError('Invalid response from server', 'INVALID_RESPONSE');
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    toast.error('Failed to fetch cart items');
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear');
    if (!response.data) throw new CartError('Invalid response from server', 'INVALID_RESPONSE');

    toast.success('Cart cleared successfully');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    toast.error(error.message || 'Failed to clear cart');
    throw error;
  }
};

export const validateCart = async () => {
  try {
    const response = await api.get('/cart/validate');
    if (!response.data) throw new CartError('Invalid response from server', 'INVALID_RESPONSE');

    return response.data;
  } catch (error) {
    console.error('Error validating cart:', error);
    toast.error(error.message || 'Cart validation failed');
    throw error;
  }
};

export const validateQuantity = (quantity) => {
  const parsedQuantity = parseInt(quantity);
  return (
    !isNaN(parsedQuantity) &&
    Number.isInteger(parsedQuantity) &&
    parsedQuantity >= MIN_QUANTITY &&
    parsedQuantity <= MAX_QUANTITY
  );
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price || 0);
};

// Cart calculation functions
export const calculateSubtotal = (items) => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.product?.price || 0);
    const quantity = validateQuantity(item.quantity) ? item.quantity : 0;
    return total + (price * quantity);
  }, 0);
};

export const calculateTax = (subtotal, taxRate = 0.18) => {
  return subtotal * taxRate;
};

export const calculateTotal = (items, taxRate = 0.18, shippingCost = 0) => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax + shippingCost;
};

export const validateCartItem = (item) => {
  return (
    item &&
    item.product &&
    typeof item.product._id === 'string' &&
    typeof item.product.name === 'string' &&
    typeof item.product.price === 'number' &&
    validateQuantity(item.quantity)
  );
};