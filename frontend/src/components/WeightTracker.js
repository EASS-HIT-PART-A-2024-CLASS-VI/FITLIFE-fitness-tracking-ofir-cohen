import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Graph from './graph';

const WeightTracker = () => {
  const [weights, setWeights] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get('http://localhost:8000/weight/1'); // Replace '1' with user ID
        const logs = response.data.logs;
        setWeights(logs.map(log => log.weight));
        setDates(logs.map(log => log.date));
      } catch (error) {
        console.error('Error fetching weight data:', error);
      }
    };
    fetchWeights();
  }, []);

  return (
    <div>
      <h1>Weight Tracker</h1>
      <Graph data={weights} labels={dates} title="Weight Progress" />
    </div>
  );
};

export default WeightTracker;
