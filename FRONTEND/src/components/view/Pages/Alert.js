import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import '../../../styles/Pages.css';

const Alert = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const capitalize = useCallback((word) => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!message || !isVisible) return null;

  const alertClass = `alert alert-${type} alert-dismissible fade show animate-fade-in`;
  const icons = {
    success: 'check-circle-fill',
    error: 'exclamation-circle-fill',
    warning: 'exclamation-triangle-fill',
    info: 'info-circle-fill'
  };

  return (
    <div 
      className={alertClass} 
      role="alert"
      aria-live="polite"
    >
      <div className="d-flex align-items-center">
        <i className={`bi bi-${icons[type]} me-2`}></i>
        <div className="flex-grow-1">
          <strong className="me-1">{capitalize(type)}:</strong>
          {message}
        </div>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </div>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func
};

export default React.memo(Alert);
