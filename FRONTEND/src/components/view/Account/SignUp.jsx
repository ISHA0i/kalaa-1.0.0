import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import authService from '../../../services/authService';
import { toast } from 'react-toastify';
import '../../../styles/SignUp.css';

const SignUp = ({ redirectPath = '/signin' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value, allValues = formData) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Name is required' : 
               value.trim().length < 2 ? 'Name must be at least 2 characters long' : '';
      case 'email':
        return !value ? 'Email is required' :
               !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email address' : '';
      case 'password':
        return !value ? 'Password is required' :
               value.length < 6 ? 'Password must be at least 6 characters long' :
               !/[A-Z]/.test(value) ? 'Password must contain at least one uppercase letter' :
               !/[0-9]/.test(value) ? 'Password must contain at least one number' : '';
      case 'confirmPassword':
        return !value ? 'Please confirm your password' :
               value !== allValues.password ? 'Passwords do not match' : '';
      default:
        return '';
    }
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value.trim()
      };
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value.trim(), newData),
        ...(name === 'password' ? {
          confirmPassword: newData.confirmPassword ? 
            validateField('confirmPassword', newData.confirmPassword, newData) : ''
        } : {})
      }));
      return newData;
    });
  }, [validateField]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key], formData);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { confirmPassword, ...registrationData } = formData;
      await authService.register(registrationData);
      toast.success('Registration successful! Please sign in to continue.');
      navigate(redirectPath);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      if (error.response?.status === 409) {
        setErrors({ email: 'This email is already registered' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Create Account</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={loading}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    disabled={loading}
                    required
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                  <small className="form-text text-muted">
                    Password must be at least 6 characters long, contain an uppercase letter and a number
                  </small>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    disabled={loading}
                    required
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : 'Create Account'}
                </button>
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account? <Link to="/signin" className="text-primary">Sign In</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  redirectPath: PropTypes.string
};

export default React.memo(SignUp);
