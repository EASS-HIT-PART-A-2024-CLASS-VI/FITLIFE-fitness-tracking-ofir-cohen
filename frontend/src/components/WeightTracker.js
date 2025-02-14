import React, { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './WeightTracker.css';
import weightTrackerImage from '../assets/weight-tracker-image.jpg';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const WeightTracker = () => {
  const [weightLogs, setWeightLogs] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [logDate, setLogDate] = useState('');
  const [filter, setFilter] = useState('all');
  const userId = localStorage.getItem("user_id");

  // Ensure userId is valid before making API calls
  const parsedUserId = userId ? parseInt(userId, 10) : null;

  const fetchWeightLogs = useCallback(async () => {
    if (!parsedUserId) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/weight/${parsedUserId}`);
      if (!response.ok) throw new Error("Failed to fetch weight logs");

      const data = await response.json();
      setWeightLogs(data.logs || []);
    } catch (error) {
      console.error("Error fetching weight logs:", error);
    }
  }, [parsedUserId]);

  useEffect(() => {
    fetchWeightLogs();
  }, [fetchWeightLogs]);

  const handleAddLog = async () => {
    if (!newWeight || !logDate) {
      alert("Please enter a valid weight and date.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (logDate > today) {
      alert("Future dates are not allowed!");
      return;
    }

    if (!parsedUserId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const weightData = { 
      user_id: parsedUserId, 
      weight: parseFloat(newWeight), 
      date: logDate 
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/weight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(weightData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add weight log");
      }

      await fetchWeightLogs();
      setNewWeight('');
      setLogDate('');
    } catch (error) {
      console.error("Error adding weight log:", error);
      alert(error.message);
    }
  };

  const filteredLogs = weightLogs.filter((log) => {
    const logDate = new Date(log.date);
    const today = new Date();
    switch (filter) {
      case '7d':
        return logDate >= new Date(today.setDate(today.getDate() - 7));
      case '30d':
        return logDate >= new Date(today.setDate(today.getDate() - 30));
      case '90d':
        return logDate >= new Date(today.setDate(today.getDate() - 90));
      case '180d':
        return logDate >= new Date(today.setDate(today.getDate() - 180));
      case '1y':
        return logDate >= new Date(today.setFullYear(today.getFullYear() - 1));
      default:
        return true;
    }
  });

  const chartData = {
    labels: filteredLogs.map((log) => log.date),
    datasets: [
      {
        label: 'Weight (kg)',
        data: filteredLogs.map((log) => log.weight),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="weight-tracker">
      <div className="weight-header">
        <h1>Weight Tracker</h1>
        <img 
          src={weightTrackerImage} 
          alt="Weight Tracker" 
          className="weight-header-image" 
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          placeholder="Weight (kg)"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
        />
        <input
          type="date"
          value={logDate}
          onChange={(e) => setLogDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]} // Prevents selecting future dates
        />
        <button onClick={handleAddLog}>Add weight Log</button>
      </div>
      <div className="filter-buttons">
        <button onClick={() => setFilter('7d')}>Last 7 days</button>
        <button onClick={() => setFilter('30d')}>Last 30 days</button>
        <button onClick={() => setFilter('90d')}>Last 90 days</button>
        <button onClick={() => setFilter('180d')}>Last 180 days</button>
        <button onClick={() => setFilter('1y')}>Last year</button>
        <button onClick={() => setFilter('all')}>All time</button>
      </div>
      <div className="chart-container weight-chart">
        {filteredLogs.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>No weight logs available. Add some data to see your progress!</p>
        )}
      </div>
    </div>
  );
};

export default WeightTracker;