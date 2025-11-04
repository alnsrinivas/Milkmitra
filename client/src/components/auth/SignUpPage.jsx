import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from './AuthPageLayout';
import { API_URL } from '../../config/api';

const SignUpPage = ({ showNotification }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "customer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");

      showNotification("Registration successful! Please log in.");
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <AuthPageLayout
      imageUrl=""
      imageTitle="Join Milk Mitra"
      imageText="Start your journey towards fresh, high-quality milk."
    >
      <h3 className="form-title">Create Your Customer Account</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-person"></i>
          </span>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            className="form-control"
            placeholder="Username"
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-envelope"></i>
          </span>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="form-control"
            placeholder="Email"
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-telephone"></i>
          </span>
          <input
            type="tel"
            name="phone"
            onChange={handleChange}
            className="form-control"
            placeholder="Phone Number"
            required
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-lock"></i>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
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
            Create Account
          </button>
        </div>
        <div className="form-link-text">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default SignUpPage;