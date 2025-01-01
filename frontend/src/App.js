import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import WorkoutTracker from './components/WorkoutTracker';
import NutritionTracker from './components/NutritionTracker';
import WeightTracker from './components/WeightTracker';
import CalorieRecommendations from './components/CalorieRecommendations';
import TrainingPrograms from './components/TrainingPrograms';

const App = () => {
  return (
    <Router>
      <header>
        <h1>Welcome to FITLIFE</h1>
      </header>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/user-management">User Management</Link>
        <Link to="/workout-tracker">Workout Tracker</Link>
        <Link to="/nutrition-tracker">Nutrition Tracker</Link>
        <Link to="/weight-tracker">Weight Tracker</Link>
        <Link to="/calorie-recommendations">Calorie Recommendations</Link>
        <Link to="/training-programs">Training Programs</Link>
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
