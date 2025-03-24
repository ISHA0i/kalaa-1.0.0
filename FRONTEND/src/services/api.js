import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
const MAX_RETRIES = 3;
const TIMEOUT = 10000; // 10 seconds

// Validate API URL
const validateApiUrl = (url) => {
  try {
    new URL(url);
    return url;
  } catch (error) {
    console.error('Invalid API URL:', error);
    return 'http://localhost:5002/api';
  }
};

const api = axios.create({
  baseURL: validateApiUrl(API_URL),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUT,
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && typeof token === 'string' && token.startsWith('Bearer ')) {
      config.headers.Authorization = token;
    } else if (token && typeof token === 'string') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry failed requests (except for auth-related endpoints)
    if (
      error.response &&
      !originalRequest._retry &&
      originalRequest.retryCount < MAX_RETRIES &&
      !originalRequest.url.includes('/auth/')
    ) {
      originalRequest._retry = true;
      originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;

      // Exponential backoff
      const backoffDelay = Math.pow(2, originalRequest.retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, backoffDelay));

      return api(originalRequest);
    }

    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
      // Handle 403 Forbidden
      else if (error.response.status === 403) {
        window.location.href = '/unauthorized';
      }
      // Handle 404 Not Found
      else if (error.response.status === 404) {
        console.error('Resource not found:', error.config.url);
      }
      // Handle 500 Server Error
      else if (error.response.status >= 500) {
        console.error('Server Error:', error.response.status);
      }
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api; 