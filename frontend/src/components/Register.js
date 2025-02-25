import React, { useState } from "react";
import "./Login.css"; 
import logo from "../assets/fitlife_logo.png";

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Try again.");
      }

      alert("Registration successful! You can now log in.");
      onRegisterSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="FitLife Logo" className="login-logo" />
      <h2>Register to FitLife</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gender" onChange={handleChange} />
        <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} />
        <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} />
        <button type="submit" className="login-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
