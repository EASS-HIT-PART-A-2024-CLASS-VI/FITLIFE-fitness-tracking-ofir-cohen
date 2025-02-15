import React, { useState } from "react";
import axios from "axios";
import "./CalorieRecommendations.css"; 
import calorieCalculatorImage from '../assets/calorie-calculator-image.jpg';

const CalorieRecommendations = () => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activity_level: "",
    target: "",
  });

  const [recommendedCalories, setRecommendedCalories] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://127.0.0.1:8000/recommended-calories", {
        params: formData,
      });

      let adjustedCalories = response.data.recommended_calories;

      // Adjust calorie intake based on goal
      if (formData.target === "muscle gain") {
        adjustedCalories += 150;  // Increase for muscle gain
      } else if (formData.target === "weight loss") {
        adjustedCalories -= 200;  // Decrease for weight loss
      }

      setRecommendedCalories(adjustedCalories);
      setError(null);
    } catch (err) {
      setError("Failed to fetch recommended calories. Please check your inputs.");
      setRecommendedCalories(null);
    }
  };

  return (
    <div className="calorie-recommendations">
      <div className="calorie-header">
        <h1>Calorie Recommendations</h1>
        <img 
          src={calorieCalculatorImage} 
          alt="Calorie Calculator" 
          className="calorie-header-image" 
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Height (cm):</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label>Activity Level:</label>
          <select
            name="activity_level"
            value={formData.activity_level}
            onChange={handleChange}
            required
          >
            <option value="">Select activity level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fitness Goal:</label>
          <select
            name="target"
            value={formData.target}
            onChange={handleChange}
            required
          >
            <option value="">Select your goal</option>
            <option value="maintenance">Maintenance</option>
            <option value="muscle gain">Muscle Gain</option>
            <option value="weight loss">Weight Loss</option>
          </select>
        </div>

        <button type="submit">Calculate</button>
      </form>

      {recommendedCalories && (
        <div className="result">
          <h3>Recommended Calories: {recommendedCalories}</h3>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CalorieRecommendations;