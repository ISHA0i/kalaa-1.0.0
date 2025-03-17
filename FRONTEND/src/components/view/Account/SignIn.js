import React, { useState } from 'react';
import { signIn } from '../../../services/authService'; // Correctly import signIn

const SignIn = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signIn(credentials); // Call the signIn function
      setMessage(response.message);
      setError('');
      localStorage.setItem('token', response.token); // Save token to localStorage
    } catch (err) {
      setError(err.message || 'An error occurred');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
