import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './NutritionTracker.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionTracker = () => {
  const [foodLogs, setFoodLogs] = useState(() => {
    return JSON.parse(localStorage.getItem('foodLogs')) || {}; // Load from localStorage
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('');
  const [calorieGoal, setCalorieGoal] = useState(() => {
    return localStorage.getItem('calorieGoal') || 2000; // Load saved goal or default to 2000
  });

  useEffect(() => {
    localStorage.setItem('foodLogs', JSON.stringify(foodLogs)); // Save food logs to localStorage
  }, [foodLogs]);

  useEffect(() => {
    localStorage.setItem('calorieGoal', calorieGoal); // Save calorie goal
  }, [calorieGoal]);

  const handleAddLog = () => {
    if (!food || !calories || !mealType) {
      alert("Please enter all details.");
      return;
    }

    const updatedLogs = { ...foodLogs };
    if (!updatedLogs[selectedDate]) {
      updatedLogs[selectedDate] = [];
    }

    updatedLogs[selectedDate].push({
      food,
      calories: parseInt(calories, 10),
      mealType,
    });

    setFoodLogs(updatedLogs);
    setFood('');
    setCalories('');
    setMealType('');
  };

  const handleDateChange = (direction) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);

    // Prevent navigating to future dates
    const today = new Date().toISOString().split('T')[0];
    if (currentDate.toISOString().split('T')[0] > today) {
      return;
    }

    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const selectedLogs = foodLogs[selectedDate] || [];
  const totalCalories = selectedLogs.reduce((sum, log) => sum + log.calories, 0);

  const chartData = {
    labels: selectedLogs.map(log => log.food.toUpperCase()),
    datasets: [
      {
        label: 'Calories',
        data: selectedLogs.map(log => log.calories),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF4500'],
      },
    ],
  };

  return (
    <div className="nutrition-tracker">
      <h1>Nutrition Tracker</h1>

      <div className="form-group">
        <input
          type="text"
          placeholder="Food"
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />
        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
        <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="">Select Meal Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
        <button onClick={handleAddLog}>Add Log</button>
      </div>

      <div className="date-navigation">
        <button onClick={() => handleDateChange(-1)}>← Previous Day</button>
        <span>{selectedDate}</span>
        <button onClick={() => handleDateChange(1)}>Next Day →</button>
      </div>

      <div className="daily-goal">
        <strong>Daily Calorie Goal:</strong>
        <input
          type="number"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(e.target.value)}
        />
      </div>

      <div className="chart-container">
        {selectedLogs.length > 0 ? (
          <Pie data={chartData} options={{ maintainAspectRatio: false }} />
        ) : (
          <p>No food logs for this day.</p>
        )}
      </div>

      <div className="calorie-summary">
        Total Calories: {totalCalories} / {calorieGoal}
      </div>
    </div>
  );
};

export default NutritionTracker;