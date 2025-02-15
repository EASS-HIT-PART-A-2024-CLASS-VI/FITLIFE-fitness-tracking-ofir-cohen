import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/fitlife_logo.png';
import loginBackground from '../assets/login-background.jpg';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegistering ? 'http://127.0.0.1:8000/register' : 'http://127.0.0.1:8000/login';
    const bodyData = isRegistering
      ? JSON.stringify(formData)
      : new URLSearchParams({ username: formData.username, password: formData.password });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': isRegistering ? 'application/json' : 'application/x-www-form-urlencoded',
        },
        body: bodyData,
      });

      if (!response.ok) {
        throw new Error(isRegistering ? 'Registration failed' : 'Invalid username or password');
      }

      const data = await response.json();
      console.log("Login Response:", data);

      if (!isRegistering) {
        localStorage.setItem('token', data.access_token);
        console.log("✅ Token stored:", data.access_token);

        const userResponse = await fetch('http://127.0.0.1:8000/me', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("Fetched User Data:", userData);

          if (userData && userData.id) {
            localStorage.setItem('user_id', userData.id);
            console.log("✅ User ID stored:", localStorage.getItem("user_id"));
          } else {
            throw new Error("User ID is missing in the response.");
          }

          onLogin();
        } else {
          throw new Error("Failed to fetch user details.");
        }
      } else {
        alert('Registration successful! Please login.');
        setIsRegistering(false);
      }
    } catch (err) {
      console.error("❌ Login/Register Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div 
      className="login-page" 
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw'
      }}
    >
      <div className="login-container">
        <img src={logo} alt="FitLife Logo" className="login-logo" />
        <h2 className="login-title">{isRegistering ? 'Register for FitLife' : 'Login to FitLife'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {isRegistering && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </>
          )}
          <button type="submit" className="login-button">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering 
            ? 'Already have an account? Login' 
            : "Don't have an account? Register here"}
        </p>
      </div>
    </div>
  );
};

export default Login;