import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = (props) => {
  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode} nav`}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/App.js">
            <b>KALAA</b>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link active "
                  aria-current="page"
                  to="/Home"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/product">
                  Product
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/About">
                  About
                </Link>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    {/* profile */}
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="nav-link dropdown-item" to="/Account">
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link dropdown-item" to="/SignUp">
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <div className=" dropdown-item form-check form-switch switch-container">
                      <div className="switch-label">
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault"
                      >
                        Dark Mode
                      </label>
                      </div>
                       <div className="switch">
                      <input
                        className="form-check-input"
                        onClick={props.toggleMOde}
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"></input>
                       </div>
                      
                    </div>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Order">
                  <i className="bi bi-cart-fill">{/* cart */}</i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
