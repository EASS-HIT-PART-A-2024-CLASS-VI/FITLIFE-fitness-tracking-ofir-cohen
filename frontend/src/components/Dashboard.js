import React from 'react';
import './Dashboard.css';
import logo from '../assets/logo.png';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src={logo} alt="FitLife Logo" className="logo" />
        <h1>Welcome to FITLIFE</h1>
        <p>Your personalized fitness tracking dashboard.</p>
      </header>
      <div className="dashboard-intro">
        <p>
          FitLife is your ultimate fitness tracker, helping you track workouts,
          monitor nutrition, set goals, and achieve your health aspirations.
          Explore features like calorie recommendations, workout tracking, and
          tailored fitness programs to transform your lifestyle.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
