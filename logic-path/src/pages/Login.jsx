import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div>
      
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
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
              <input type="password" placeholder="Enter your password" />
              <span className="icon">🔒</span>
            </div>
          </div>

          <div className="options-row">
            <label>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <a href="#" className="forgot">Forgot Password?</a>
          </div>

        <button className="login-btn" onClick={() => navigate('/map')}>Login</button>

        <p className="register-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}