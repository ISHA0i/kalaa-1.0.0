import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h5 className="mb-3">About KALAA</h5>
            <p>
              KALAA is your premier destination for unique and beautiful artworks.
              We connect talented artists with art lovers worldwide.
            </p>
            <div className="social-links">
              <a href="https://facebook.com/kalaa" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/kalaa" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com/kalaa" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="mb-3">Customer Service</h5>
            <ul className="list-unstyled">
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="col-lg-3">
            <h5 className="mb-3">Newsletter</h5>
            <p>Subscribe to receive updates about new artworks and special offers.</p>
            <form className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  aria-label="Enter your email"
                />
                <button className="btn btn-primary" type="submit">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom py-3">
        <div className="container text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} KALAA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 