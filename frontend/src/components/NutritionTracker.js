import React, { useState } from 'react';

const NutritionTracker = () => {
  const [logs, setLogs] = useState([]);
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');

  const addLog = () => {
    const log = { food, calories: parseInt(calories) };
    setLogs([...logs, log]);
    setFood('');
    setCalories('');
  };

  return (
    <div>
      <h1>Nutrition Tracker</h1>
      <div>
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
        <button onClick={addLog}>Add Log</button>
      </div>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log.food}: {log.calories} kcal</li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionTracker;
