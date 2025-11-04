import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from './AuthPageLayout';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

const FarmLoginPage = ({ showNotification }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      if (data.role !== "farmer") {
        throw new Error("This login is for farmers only.");
      }

      login(data.token);
      showNotification("Farm login successful!");
      navigate("/dashboard/dairy");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <AuthPageLayout
      imageUrl=""
      imageTitle="Farm Fresh, Delivered Daily"
      imageText="Sign in to manage your farm's products."
    >
      <h3 className="form-title">Sign In to Your Dairy Farm</h3>
      <p
        className="text-center"
        style={{ marginTop: "-1rem", color: "#5C4033" }}
      >
        Welcome back! Please enter your details.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-envelope"></i>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Your Email"
            required
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-lock"></i>
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
        <div className="form-link-text" style={{ marginTop: "-10px" }}>
          {/* ADD THIS LINK */}
          <p>
            Forgot Your password?{" "}
            <Link to="/forgot-password">Forgot Password</Link>
          </p>
        </div>
        <div className="form-link-text">
          <p>
            Don't have an account?{" "}
            <Link to="/farm-register">Register here</Link>
          </p>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default FarmLoginPage;