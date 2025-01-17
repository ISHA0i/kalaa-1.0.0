import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
        <ul className="footer-links">
          <li>
            <Link to="/About">About</Link>
          </li>
          <li>
          <Link to="/Contact">Contact</Link>
          </li>
          <li>
          <Link to="/Privacy">Privacy Policy</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
