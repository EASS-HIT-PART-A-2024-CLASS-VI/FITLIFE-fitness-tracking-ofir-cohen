import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import NutritionTracker from './components/NutritionTracker';
import WeightTracker from './components/WeightTracker';
import CalorieRecommendations from './components/CalorieRecommendations';
import TrainingPrograms from './components/TrainingPrograms';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

/**
 * Main Application Component
 * Handles routing, authentication, and navigation across the application.
 */
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Check if a user is logged in by verifying the presence of a token in localStorage.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  /**
   * Handles user logout by clearing the token from localStorage.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        // If the user is not logged in, show login and registration routes
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <>
          {/* Navigation Bar */}
          <nav className="app-nav">
            <Link to="/" className="app-link">Dashboard</Link>
            <Link to="/workout-tracker" className="app-link">Workout Tracker</Link>
            <Link to="/nutrition-tracker" className="app-link">Nutrition Tracker</Link>
            <Link to="/weight-tracker" className="app-link">Weight Tracker</Link>
            <Link to="/calorie-recommendations" className="app-link">Calorie Recommendations</Link>
            <Link to="/training-programs" className="app-link">Training Programs</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </nav>

          {/* Main Content */}
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workout-tracker" element={<WorkoutTracker />} />
              <Route path="/nutrition-tracker" element={<NutritionTracker />} />
              <Route path="/weight-tracker" element={<WeightTracker />} />
              <Route path="/calorie-recommendations" element={<CalorieRecommendations />} />
              <Route path="/training-programs" element={<TrainingPrograms />} />

              {/* Redirect any unknown paths to the dashboard */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
};

export default App;
