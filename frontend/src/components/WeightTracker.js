import React, { useState } from 'react';

const WeightTracker = () => {
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');

  const addLog = () => {
    const log = { weight: parseFloat(weight), date };
    setLogs([...logs, log]);
    setWeight('');
    setDate('');
  };

  return (
    <div>
      <h1>Weight Tracker</h1>
      <div>
        <input 
          type="number" 
          placeholder="Weight" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
        />
        <button onClick={addLog}>Add Log</button>
      </div>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log.date}: {log.weight} kg</li>
        ))}
      </ul>
    </div>
  );
};

export default WeightTracker;
