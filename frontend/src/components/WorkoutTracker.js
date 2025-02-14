import React, { useState, useEffect } from 'react';
import './WorkoutTracker.css';

const WorkoutTracker = () => {
  // ✅ Ensure correct user ID is used
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? storedUserId : 1; // Default to user 1 if no user ID found

  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // ✅ Load workouts for the specific user & date from Local Storage
  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem(`workouts_${userId}`)) || {};
    setWorkouts(savedWorkouts[selectedDate] || []);
  }, [selectedDate, userId]);

  const addWorkout = () => {
    if (!exercise || !duration) {
      alert("Please enter both exercise and duration");
      return;
    }

    const newWorkout = { id: Date.now(), exercise, duration: parseInt(duration) };

    // ✅ Save workouts separately for each user
    const savedWorkouts = JSON.parse(localStorage.getItem(`workouts_${userId}`)) || {};
    savedWorkouts[selectedDate] = [...(savedWorkouts[selectedDate] || []), newWorkout];
    localStorage.setItem(`workouts_${userId}`, JSON.stringify(savedWorkouts));

    setWorkouts(savedWorkouts[selectedDate]);
    setExercise('');
    setDuration('');
  };

  const deleteWorkout = (id) => {
    // ✅ Remove a workout by ID and update Local Storage
    const savedWorkouts = JSON.parse(localStorage.getItem(`workouts_${userId}`)) || {};
    savedWorkouts[selectedDate] = savedWorkouts[selectedDate].filter(workout => workout.id !== id);
    localStorage.setItem(`workouts_${userId}`, JSON.stringify(savedWorkouts));

    setWorkouts(savedWorkouts[selectedDate]);
  };

  const changeDate = (days) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    if (currentDate > new Date()) return; // Prevent future dates
    const newDate = currentDate.toISOString().split('T')[0];

    setSelectedDate(newDate);

    // ✅ Load workouts for the selected date & user
    const savedWorkouts = JSON.parse(localStorage.getItem(`workouts_${userId}`)) || {};
    setWorkouts(savedWorkouts[newDate] || []);
  };

  return (
    <div className="workout-container">
      <h1>Workout Tracker</h1>
      <div className="date-selector">
        <button className="date-button" onClick={() => changeDate(-1)}>← Previous Day</button>
        <span className="selected-date">{selectedDate}</span>
        <button className="date-button" onClick={() => changeDate(1)}>Next Day →</button>
      </div>
      <div className="workout-form">
        <input type="text" placeholder="Exercise" value={exercise} onChange={(e) => setExercise(e.target.value)} />
        <input type="number" placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <button onClick={addWorkout}>Add Workout</button>
      </div>
      <ul className="workout-list">
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <li key={workout.id} className="workout-item">
              {workout.exercise}: {workout.duration} minutes
              <button className="delete-button" onClick={() => deleteWorkout(workout.id)}>X</button>
            </li>
          ))
        ) : (
          <p>No workouts recorded yet for this date.</p>
        )}
      </ul>
    </div>
  );
};

export default WorkoutTracker;