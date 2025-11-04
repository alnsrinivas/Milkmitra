import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from './AuthPageLayout';
import { API_URL } from '../../config/api';

const FarmRegistrationPage = ({ showNotification }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    farmName: "", // <-- Add this
    address: "", // <-- Add this
    latitude: "", // <-- Added
    longitude: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Point to the new, combined registration route
      const res = await fetch(`${API_URL}/auth/register-farmer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Send all form data
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");

      showNotification("Registration successful! Please log in.");
      navigate("/verify-email", { state: { email: formData.email } }); // Redirect to the farmer login page
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <AuthPageLayout
      imageUrl=""
      imageTitle="Farm Fresh, Delivered Daily"
      imageText="Register your farm to connect with local communities."
    >
      <h3 className="form-title">Register as a Dairy Farmer</h3>
      <p
        className="text-center"
        style={{ marginTop: "-1rem", color: "#5C4033" }}
      >
        Create your account and register your farm details all at once.
      </p>
      <form onSubmit={handleSubmit}>
        {/* User details */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-person"></i>
          </span>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            className="form-control"
            placeholder="Owner's Full Name"
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
        <div className="alert alert-info py-2 small">
          <i className="bi bi-info-circle-fill"></i>{" "}
          <strong>How to find coordinates:</strong> Go to Google Maps,
          right-click on your farm's location, and the latitude and longitude
          will be the first item in the menu. Click to copy.
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-globe-americas"></i>
          </span>
          <input
            type="number"
            step="any"
            name="latitude"
            onChange={handleChange}
            className="form-control"
            placeholder="Latitude (e.g., 15.5052)"
            required
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-globe-americas"></i>
          </span>
          <input
            type="number"
            step="any"
            name="longitude"
            onChange={handleChange}
            className="form-control"
            placeholder="Longitude (e.g., 80.0498)"
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

        {/* Farm details */}
        <hr className="my-4" />
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-house-heart"></i>
          </span>
          <input
            type="text"
            name="farmName"
            onChange={handleChange}
            className="form-control"
            placeholder="Farm Name"
            required
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-geo-alt"></i>
          </span>
          <input
            type="text"
            name="address"
            onChange={handleChange}
            className="form-control"
            placeholder="Farm Address"
            required
          />
        </div>

        <div className="d-grid">
          <button className="btn btn-primary" type="submit">
            Create Account & Register Farm
          </button>
        </div>
        <br></br>
        <div className="form-link-text">
          <p>
            Already registered? <Link to="/farm-login">Farm Sign In</Link>
          </p>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default FarmRegistrationPage;