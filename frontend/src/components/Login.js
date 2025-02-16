import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/fitlife_logo.png';
import loginBackground from '../assets/login-background.jpg';

const Login = ({ onLogin }) => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [resetStage, setResetStage] = useState(''); 
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    email: '',
    newPassword: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/password-reset-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: formData.username,
          email: formData.email || ''
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetStage('confirm');
        setMessage('Enter your new password');
      } else {
        setError(data.detail || 'Failed to initiate password reset');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const handlePasswordResetConfirm = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    try {
      const response = await fetch('http://127.0.0.1:8000/password-reset-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: formData.username,
          new_password: formData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === "success") {
        setMessage('Password reset successful. You can now log in.');
        setResetStage('');
        setFormData(prev => ({
          ...prev,
          password: '',
          newPassword: ''
        }));
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
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

  const renderPasswordResetRequest = () => (
    <form onSubmit={handlePasswordResetRequest}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email (Optional)"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit" className="login-button">
        Request Password Reset
      </button>
      <p 
        className="toggle-auth"
        onClick={() => {
          setResetStage('');
          setError('');
          setMessage('');
        }}
      >
        Back to Login
      </p>
    </form>
  );

  const renderPasswordResetConfirm = () => (
    <form onSubmit={handlePasswordResetConfirm}>
      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={handleChange}
        required
        minLength={8}
      />
      <button type="submit" className="login-button">
        Reset Password
      </button>
      <p 
        className="toggle-auth"
        onClick={() => {
          setResetStage('');
          setError('');
          setMessage('');
        }}  
      >
        Back to Login
      </p>
    </form>
  );

  const renderLoginForm = () => (
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
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </>
      )}
      <button type="submit" className="login-button">
        {isRegistering ? 'Register' : 'Login'}
      </button>
    </form>
  );

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
        <h2 className="login-title">
          {resetStage === 'request' 
            ? 'Password Reset Request'
            : (resetStage === 'confirm'
              ? 'Confirm Password Reset'
              : (isRegistering ? 'Register for FitLife' : 'Login to FitLife'))
          }
        </h2>
        
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        
        {resetStage === 'request' 
          ? renderPasswordResetRequest()
          : (resetStage === 'confirm'
            ? renderPasswordResetConfirm()
            : renderLoginForm()
          )
        }
        
        {!resetStage && !isRegistering && (
          <p 
            className="toggle-auth forgot-password" 
            onClick={() => {
              setResetStage('request');
              setError('');
              setMessage('');
            }}
          >
            Forgot Password?
          </p>
        )}
        
        {!resetStage && (
          <p 
            className="toggle-auth" 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setMessage('');
            }}
          >
            {isRegistering 
              ? 'Already have an account? Login' 
              : "Don't have an account? Register here"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;