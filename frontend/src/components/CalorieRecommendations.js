import React, { useState } from "react";
import axios from "axios";
import "./CalorieRecommendations.css"; // Ensure you style the form appropriately

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
      setRecommendedCalories(response.data.recommended_calories);
      setError(null);
    } catch (err) {
      setError("Failed to fetch recommended calories. Please check your inputs.");
      setRecommendedCalories(null);
    }
  };

  return (
    <div className="calorie-recommendations">
      <h1>Calorie Recommendations</h1>
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
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="male or female"
            required
          />
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
          <label>Target:</label>
          <select
            name="target"
            value={formData.target}
            onChange={handleChange}
            required
          >
            <option value="">Select your goal</option>
            <option value="weight loss">Weight Loss</option>
            <option value="muscle gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
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
