import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import authService from '../../../services/authService';
import { toast } from 'react-toastify';
import '../../../styles/Profile.css';

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          toast.error('Please sign in to access your profile');
          navigate('/signin');
          return;
        }
        setUser(currentUser);
        setFormData(prev => ({
          ...prev,
          name: currentUser.name || '',
          email: currentUser.email || ''
        }));
      } catch (error) {
        toast.error('Failed to load profile data');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const validateField = useCallback((name, value, allValues = formData) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Name is required' : 
               value.trim().length < 2 ? 'Name must be at least 2 characters long' : '';
      case 'currentPassword':
        return allValues.newPassword && !value ? 'Current password is required to change password' : '';
      case 'newPassword':
        return value && value.length < 6 ? 'New password must be at least 6 characters long' :
               value && !/[A-Z]/.test(value) ? 'Password must contain at least one uppercase letter' :
               value && !/[0-9]/.test(value) ? 'Password must contain at least one number' : '';
      case 'confirmNewPassword':
        return allValues.newPassword && !value ? 'Please confirm your new password' :
               allValues.newPassword && value !== allValues.newPassword ? 'Passwords do not match' : '';
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
        ...(name === 'newPassword' ? {
          confirmNewPassword: newData.confirmNewPassword ? 
            validateField('confirmNewPassword', newData.confirmNewPassword, newData) : ''
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
      setSaving(true);
      const updateData = {
        name: formData.name,
        ...(formData.newPassword ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        } : {})
      };

      await authService.updateProfile(updateData);
      toast.success('Profile updated successfully');
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'Current password is incorrect'
        }));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout?.();
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Profile Settings</h2>
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                  type="button"
                >
                  Sign Out
                </button>
              </div>
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
                    disabled={saving}
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
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                  <small className="form-text text-muted">
                    Email cannot be changed
                  </small>
                </div>
                <hr className="my-4" />
                <h4 className="mb-3">Change Password</h4>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  {errors.currentPassword && (
                    <div className="invalid-feedback">{errors.currentPassword}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  {errors.newPassword && (
                    <div className="invalid-feedback">{errors.newPassword}</div>
                  )}
                  <small className="form-text text-muted">
                    Leave blank to keep current password
                  </small>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmNewPassword ? 'is-invalid' : ''}`}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  {errors.confirmNewPassword && (
                    <div className="invalid-feedback">{errors.confirmNewPassword}</div>
                  )}
                </div>
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving Changes...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  onLogout: PropTypes.func
};

export default React.memo(Profile);