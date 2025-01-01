import React, { useState, useEffect } from 'react';

const CalorieRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/recommended-calories?age=30&weight=70&height=175&gender=male&activity_level=medium")
      .then((response) => response.json())
      .then((data) => setRecommendations(data))
      .catch((error) => console.error("Error fetching calorie recommendations:", error));
  }, []);

  return (
    <div>
      <h1>Calorie Recommendations</h1>
      {recommendations ? (
        <p>Recommended Calories: {recommendations.recommended_calories}</p>
      ) : (
        <p>Loading recommendations...</p>
      )}
    </div>
  );
};

export default CalorieRecommendations;
