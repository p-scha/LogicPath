import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login({ username: email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/map");
    } catch (err) {
      console.error("Login failed", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="icon">🔒</span>
            </div>
          </div>

          <div className="options-row">
            <label>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <a href="#" className="forgot">Forgot Password?</a>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          <p className="register-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export { Login };
