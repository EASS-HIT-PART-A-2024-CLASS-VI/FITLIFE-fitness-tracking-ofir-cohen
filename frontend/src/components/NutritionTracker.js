import React, { useState } from 'react';
import CaloriePieChart from './CaloriePieChart';
import './NutritionTracker.css';

const NutritionTracker = () => {
  const [foodLogs, setFoodLogs] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000); // Default daily goal
  const [foodInput, setFoodInput] = useState({ food: '', calories: '', mealType: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodInput({ ...foodInput, [name]: value });
  };

  const handleAddLog = () => {
    if (foodInput.food && foodInput.calories > 0 && foodInput.mealType) {
      setFoodLogs([...foodLogs, { ...foodInput, calories: parseInt(foodInput.calories, 10) }]);
      setFoodInput({ food: '', calories: '', mealType: '' });
    } else {
      alert('Please fill out all fields with valid values.');
    }
  };

  const handleDeleteLog = (index) => {
    setFoodLogs(foodLogs.filter((_, i) => i !== index));
  };

  const handleGoalChange = (e) => {
    const newGoal = parseInt(e.target.value, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      setDailyGoal(newGoal);
    } else {
      alert('Please enter a valid daily goal.');
    }
  };

  const totalCalories = foodLogs.reduce((sum, log) => sum + log.calories, 0);

  return (
    <div className="nutrition-tracker">
      <h1>Nutrition Tracker</h1>
      <div className="form-group">
        <input
          type="text"
          name="food"
          placeholder="Food"
          value={foodInput.food}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={foodInput.calories}
          onChange={handleInputChange}
        />
        <select
          name="mealType"
          value={foodInput.mealType}
          onChange={handleInputChange}
        >
          <option value="" disabled>Select Meal Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
        <button onClick={handleAddLog}>Add Log</button>
      </div>
      <div className="goal-input">
        <label htmlFor="daily-goal">Daily Calorie Goal: </label>
        <input
          id="daily-goal"
          type="number"
          value={dailyGoal}
          onChange={handleGoalChange}
        />
      </div>
      <div className="chart-container">
        {foodLogs.length > 0 ? (
          <CaloriePieChart foodLogs={foodLogs} dailyGoal={dailyGoal} />
        ) : (
          <p>No food logs available. Start adding your meals to track calories.</p>
        )}
      </div>
      <p>Total Calories: {totalCalories} / {dailyGoal}</p>
    </div>
  );
};

export default NutritionTracker;
