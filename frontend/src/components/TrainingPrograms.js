import React, { useState, useEffect } from 'react';

const TrainingPrograms = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/scrape-training-program?goal=weight_loss")
      .then((response) => response.json())
      .then((data) => setPrograms(data.training_programs))
      .catch((error) => console.error("Error fetching training programs:", error));
  }, []);

  return (
    <div>
      <h1>Training Programs</h1>
      <ul>
        {programs.map((program, index) => (
          <li key={index}>
            <a href={program.link} target="_blank" rel="noopener noreferrer">{program.title}</a>
            <p>{program.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainingPrograms;
