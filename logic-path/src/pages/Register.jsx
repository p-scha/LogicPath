import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await register({ username: email, password });

      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <div className="register-container">
        <div className="register-box">
          <h2>Create Account</h2>

          <div className="input-group">
            <label>Name</label>
            <div className="input-field">
              <input 
                type="text" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="icon">👤</span>
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-field">
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="icon">📧</span>
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-field">
              <input 
                type="password" 
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="icon">🔒</span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-field">
              <input 
                type="password" 
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="icon">🔒</span>
            </div>
          </div>

          <button className="register-btn" onClick={handleRegister}>
            Register
          </button>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
