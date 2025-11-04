import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Note the path
import { API_URL } from '../../config/api';         // Import the API URL
import AuthPageLayout from './AuthPageLayout';
const LoginPage = ({ showNotification }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to login");

      login(data.token);
      showNotification("Login successful!");
      if (data.role === "farmer") {
        navigate("/dashboard/dairy");
      } else {
        navigate("/dashboard/customer");
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <AuthPageLayout
      imageUrl=""
      imageTitle="Welcome Back!"
      imageText="Sign in to continue."
    >
      <h3 className="form-title">Login</h3>
      <p
        className="text-muted text-center"
        style={{ marginTop: "-1rem", marginBottom: "1rem" }}
      >
        Enter your credentials to access your account.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-envelope-fill"></i>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Email address"
            required
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-lock-fill"></i>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Password"
            required
          />
          <span
            className="input-group-text"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
          </span>
        </div>
        <div className="d-grid">
          <button className="btn btn-primary" type="submit">
            Sign In
          </button>
        </div>
        <br></br>
        <div className="form-link-text">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
        <div className="form-link-text">
          {/* ADD THIS LINK */}
          <p>
            Forgot Your password?{" "}
            <Link to="/forgot-password">Forgot Password</Link>
          </p>
        </div>
        <div className="form-link-text">
          <p>
            Are you a farmer? <Link to="/farm-register">Register here</Link>
          </p>
        </div>
      </form>
    </AuthPageLayout>
  );
};
export default LoginPage;