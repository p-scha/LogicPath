import { Link } from "react-router-dom";

import "./Register.css";

export default function Register() {
  return (
    <div>

      <div className="register-container">
        <div className="register-box">
          <h2>Create Account</h2>

          <div className="input-group">
            <label>Name</label>
            <div className="input-field">
              <input type="text" placeholder="Enter your name" />
              <span className="icon">👤</span>
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-field">
              <input type="email" placeholder="Enter your email" />
              <span className="icon">📧</span>
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-field">
              <input type="password" placeholder="Create a password" />
              <span className="icon">🔒</span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-field">
              <input type="password" placeholder="Confirm your password" />
              <span className="icon">🔒</span>
            </div>
          </div>

          <button className="register-btn">Register</button>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}