import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthPageLayout from './AuthPageLayout';
import { API_URL } from '../../config/api';

const ResetPasswordPage = ({ showNotification }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams(); // Gets the token from the URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showNotification("Passwords do not match.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password.");

      showNotification(
        "Password reset successfully! Please log in with your new password."
      );
      navigate("/login");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <AuthPageLayout
      imageUrl="/images/coverc.jpg"
      imageTitle="Set a New Password"
      imageText="Choose a strong, new password for your account."
    >
      <h3 className="form-title">Create New Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-lock-fill"></i>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="New Password"
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
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-lock-fill"></i>
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control"
            placeholder="Confirm New Password"
            required
          />
        </div>
        <div className="d-grid">
          <button className="btn btn-primary" type="submit">
            Reset Password
          </button>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default ResetPasswordPage;