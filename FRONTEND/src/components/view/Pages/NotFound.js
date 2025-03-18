import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/Page.css';

const NotFound = () => {
  return (
    <div className="not-found-container text-center py-5">
      <div className="container">
        <h1 className="display-1 fw-bold text-primary mb-4">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-5">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 