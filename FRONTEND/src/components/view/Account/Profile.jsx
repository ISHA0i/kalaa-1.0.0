import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const alertShown = useRef(false); // Track if the alert has been shown

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (!alertShown.current) {
          alert('Please log in first to view your profile'); // Show alert only once
          alertShown.current = true; // Mark alert as shown
        }
        navigate('/SignIn'); // Redirect to sign-in
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/users/profile', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 401) {
          if (!alertShown.current) {
            alert('Please log in first to view your profile'); // Show alert only once
            alertShown.current = true; // Mark alert as shown
          }
          navigate('/SignIn'); // Redirect to sign-in
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError('Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (error) {
    return <div className="profile-container">{error}</div>;
  }

  if (!user) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>
      <div className="profile-details">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;