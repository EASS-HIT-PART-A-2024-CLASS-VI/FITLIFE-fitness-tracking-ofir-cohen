import React, { useState } from 'react';
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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const WeightTracker = () => {
  const [weightLogs, setWeightLogs] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [logDate, setLogDate] = useState('');
  const [filter, setFilter] = useState('all');

  const handleAddLog = () => {
    if (newWeight && logDate) {
      setWeightLogs([...weightLogs, { date: logDate, weight: parseFloat(newWeight) }]);
      setNewWeight('');
      setLogDate('');
    } else {
      alert('Please enter a valid weight and date.');
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
        label: 'Weight',
        data: filteredLogs.map((log) => log.weight),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="weight-tracker">
      <h1>Weight Tracker</h1>
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
        />
        <button onClick={handleAddLog}>Add Log</button>
      </div>
      <div className="filter-buttons">
        <button onClick={() => setFilter('7d')}>Last 7 days</button>
        <button onClick={() => setFilter('30d')}>Last 30 days</button>
        <button onClick={() => setFilter('90d')}>Last 90 days</button>
        <button onClick={() => setFilter('180d')}>Last 180 days</button>
        <button onClick={() => setFilter('1y')}>Last year</button>
        <button onClick={() => setFilter('all')}>All time</button>
      </div>
      <div className="chart-container">
        {filteredLogs.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>No weight logs available. Add some data to see your progress!</p>
        )}
      </div>
    </div>
  );
};

export default WeightTracker;
