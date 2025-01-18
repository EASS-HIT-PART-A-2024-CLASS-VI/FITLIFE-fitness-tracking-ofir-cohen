import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Do not render the Navbar on the Dashboard page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
      <ul style={{ listStyleType: 'none', display: 'flex', gap: '20px' }}>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/workouts">Workout Tracker</Link></li>
        <li><Link to="/nutrition">Nutrition Tracker</Link></li>
        <li><Link to="/weight">Weight Tracker</Link></li>
        <li><Link to="/calories">Calorie Recommendations</Link></li>
        <li><Link to="/training-programs">Training Programs</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
