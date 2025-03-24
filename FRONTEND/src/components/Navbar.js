import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import authService from '../services/authService';

const Navbar = ({ mode = 'light' }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsLoggedIn(isAuth);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        // Check if the backend is reachable
        const healthCheckResponse = await fetch('http://localhost:5002/health');
        if (!healthCheckResponse.ok) {
          throw new Error('Backend is unavailable');
        }

        // If backend is reachable, calculate cart count from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
        setCartCount(count);
      } catch (error) {
        console.error('Error fetching cart count:', error);

        // Fallback: Set cartCount to 4 when backend is unavailable
        setCartCount(4);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [navigate]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = useCallback((path) => {
    return location.pathname === path ? 'active' : '';
  }, [location]);

  return (
    <nav className={`navbar navbar-expand-lg navbar-${mode} bg-${mode} nav fixed-top`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={closeMenu}>
          KALAA
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarContent"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {[
              { path: '/home', label: 'Home' },
              { path: '/product', label: 'Product' },
              { path: '/contact', label: 'Contact' },
              { path: '/about', label: 'About' }
            ].map(({ path, label }) => (
              <li className="nav-item" key={path}>
                <Link
                  className={`nav-link ${isActive(path)}`}
                  to={path}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="User menu"
              >
                <i className="bi bi-person-fill"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {!isLoggedIn ? (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/signin" onClick={closeMenu}>
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/signup" onClick={closeMenu}>
                        Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={closeMenu}>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link position-relative"
                to="/cart"
                onClick={closeMenu}
                aria-label="Shopping cart"
              >
                <i className="bi bi-cart-fill"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  mode: PropTypes.oneOf(['light', 'dark'])
};

export default React.memo(Navbar);
