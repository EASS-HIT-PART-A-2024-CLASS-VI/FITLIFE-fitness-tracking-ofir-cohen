import React, { useState } from 'react';

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [duration, setDuration] = useState('');

  const addWorkout = () => {
    const workout = { exercise, duration: parseInt(duration) };
    setWorkouts([...workouts, workout]);
    setExercise('');
    setDuration('');
  };

  return (
    <div>
      <h1>Workout Tracker</h1>
      <div>
        <input 
          type="text" 
          placeholder="Exercise" 
          value={exercise} 
          onChange={(e) => setExercise(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Duration (minutes)" 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)} 
        />
        <button onClick={addWorkout}>Add Workout</button>
      </div>
      <ul>
        {workouts.map((workout, index) => (
          <li key={index}>{workout.exercise}: {workout.duration} minutes</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutTracker;
