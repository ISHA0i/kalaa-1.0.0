import React, { memo } from "react";
import PropTypes from 'prop-types';
import Navbarpage from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import "../styles/Controls.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Controls = (WrappedComponent) => {
  // Preserve the display name for debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  // Create the wrapped component
  const ControlledComponent = memo((props) => {
    return (
      <ErrorBoundary>
        <div className="page-container">
          <header className="navbar-container">
            <Navbarpage />
          </header>

          <main className="content">
            <WrappedComponent {...props} />
          </main>

          <footer className="footer-container">
            <Footer />
          </footer>
        </div>
      </ErrorBoundary>
    );
  });

  // Set display name for debugging
  ControlledComponent.displayName = `Controls(${displayName})`;

  // PropTypes validation
  ControlledComponent.propTypes = {
    ...WrappedComponent.propTypes
  };

  return ControlledComponent;
};

Controls.propTypes = {
  children: PropTypes.node
};

export default Controls;
