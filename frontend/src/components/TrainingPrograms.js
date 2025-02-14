import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrainingPrograms.css';
import fitnessImage1 from '../assets/fitness-image-1.jpg';
import fitnessImage2 from '../assets/fitness-image-2.jpg';

const TrainingPrograms = () => {
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/training-programs')
      .then((response) => {
        setAvailablePrograms(response.data.available_programs);
      })
      .catch((error) => {
        console.error('Error fetching training programs:', error);
      });
  }, []);

  const handleDownload = () => {
    if (!selectedProgram) {
      alert('Please select a training program.');
      return;
    }

    window.open(`http://127.0.0.1:8000/training-programs/${selectedProgram}`, '_blank');
  };

  return (
    <div className="training-programs-container">
      <div className="program-images">
        <img src={fitnessImage1} alt="Fitness 1" className="program-image" />
        <img src={fitnessImage2} alt="Fitness 2" className="program-image" />
      </div>
      <h1>Training Programs</h1>
      <p>Select your fitness goal and download a personalized training program.</p>
      <div className="program-select">
        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="program-dropdown"
        >
          <option value="">Select a program</option>
          {availablePrograms.map((program) => (
            <option key={program} value={program}>
              {program.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
        <button onClick={handleDownload} className="download-button">
          Download Program
        </button>
      </div>
    </div>
  );
};

export default TrainingPrograms;