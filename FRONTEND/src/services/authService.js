import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/auth'; // Use environment variable for API base URL

// Sign-Up API
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Sign-In API
export const signIn = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};