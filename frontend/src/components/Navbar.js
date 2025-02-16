import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Ensure this import is present

const Navbar = () => {
  const location = useLocation();

  // Do not render the Navbar on the Dashboard page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
        <li><Link to="/workouts" className="navbar-link">Workout Tracker</Link></li>
        <li><Link to="/nutrition" className="navbar-link">Nutrition Tracker</Link></li>
        <li><Link to="/weight" className="navbar-link">Weight Tracker</Link></li>
        <li><Link to="/calories" className="navbar-link">Calorie Recommendations</Link></li>
        <li><Link to="/training-programs" className="navbar-link">Training Programs</Link></li>
        <li><Link to="/fitness-bot" className="navbar-link">Fitness Bot</Link></li>
        <li><Link to="/logout" className="navbar-link logout-button">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;