import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
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
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/workouts" element={<WorkoutTracker />} />
        <Route path="/nutrition" element={<NutritionTracker />} />
        <Route path="/weight" element={<WeightTracker />} />
        <Route path="/calories" element={<CalorieRecommendations />} />
        <Route path="/training-programs" element={<TrainingPrograms />} />
      </Routes>
    </Router>
  );
};

export default App;
