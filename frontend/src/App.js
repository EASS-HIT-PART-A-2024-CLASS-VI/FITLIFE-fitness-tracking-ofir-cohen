import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
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
 * Handles navigation and login state
 */
const MainApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Check login status on app load
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  /**
   * Maintain last visited page
   */
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location.pathname, isLoggedIn]);

  /**
   * Handles user logout
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastVisitedPage');
    setIsLoggedIn(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
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

          {/* Smoothly Rendering Routes */}
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workout-tracker" element={<WorkoutTracker />} />
              <Route path="/nutrition-tracker" element={<NutritionTracker />} />
              <Route path="/weight-tracker" element={<WeightTracker />} />
              <Route path="/calorie-recommendations" element={<CalorieRecommendations />} />
              <Route path="/training-programs" element={<TrainingPrograms />} />
              {/* Redirect unknown paths to last visited page or dashboard */}
              <Route path="*" element={<Navigate to={localStorage.getItem('lastVisitedPage') || "/"} replace />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
};

/**
 * App Wrapper with Router to Ensure Navigation Works
 */
const App = () => (
  <Router>
    <MainApp />
  </Router>
);

export default App;
