import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
      <ul style={{ listStyleType: 'none', display: 'flex', gap: '20px' }}>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/users">User Management</Link></li>
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
