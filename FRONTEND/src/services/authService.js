import api from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Password validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    throw new Error('Password must be at least 8 characters long');
  }
  if (!hasUpperCase || !hasLowerCase) {
    throw new Error('Password must contain both uppercase and lowercase letters');
  }
  if (!hasNumbers) {
    throw new Error('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    throw new Error('Password must contain at least one special character');
  }
};

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        if (response.data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        }
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { message: 'Login failed. Please try again.' };
    }
  },

  register: async (userData) => {
    try {
      // Validate password before sending request
      validatePassword(userData.password);
      
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { message: 'Registration failed. Please try again.' };
    }
  },

  logout: async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of server response
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        }
      }
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = Date.now() >= payload.exp * 1000;

      if (isExpired) {
        authService.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      authService.logout();
      return false;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      if (response.data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error.response?.data || { message: 'Profile update failed. Please try again.' };
    }
  }
};

export default authService;