import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import WorkoutTracker from './components/WorkoutTracker';
import NutritionTracker from './components/NutritionTracker';
import WeightTracker from './components/WeightTracker';
import CalorieRecommendations from './components/CalorieRecommendations';
import TrainingPrograms from './components/TrainingPrograms';
import './App.css'; // For any global styles

const App = () => {
  return (
    <Router>
      <nav className="app-nav">
        <Link to="/" className="app-link">Dashboard</Link>
        <Link to="/user-management" className="app-link">User Management</Link>
        <Link to="/workout-tracker" className="app-link">Workout Tracker</Link>
        <Link to="/nutrition-tracker" className="app-link">Nutrition Tracker</Link>
        <Link to="/weight-tracker" className="app-link">Weight Tracker</Link>
        <Link to="/calorie-recommendations" className="app-link">Calorie Recommendations</Link>
        <Link to="/training-programs" className="app-link">Training Programs</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/workout-tracker" element={<WorkoutTracker />} />
          <Route path="/nutrition-tracker" element={<NutritionTracker />} />
          <Route path="/weight-tracker" element={<WeightTracker />} />
          <Route path="/calorie-recommendations" element={<CalorieRecommendations />} />
          <Route path="/training-programs" element={<TrainingPrograms />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
