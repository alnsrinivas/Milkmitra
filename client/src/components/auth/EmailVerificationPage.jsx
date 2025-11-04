import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthPageLayout from './AuthPageLayout';
import { API_URL } from '../../config/api';

const EmailVerificationPage = ({ showNotification }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email from registration page

  useEffect(() => {
    if (!email) {
      showNotification(
        "No email address provided. Please register first.",
        "error"
      );
      navigate("/signup");
    }
  }, [email, navigate, showNotification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to verify OTP.");

      showNotification("Email verified successfully! You can now log in.");
      navigate("/login");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <AuthPageLayout
      imageUrl="/images/mm2.jpg"
      imageTitle="Almost There!"
      imageText="Check your inbox for the verification code."
    >
      <h3 className="form-title">Verify Your Email</h3>
      <p className="text-center" style={{ marginTop: "-1rem" }}>
        An OTP has been sent to <strong>{email}</strong>. Please enter it below.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-shield-check"></i>
          </span>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-control"
            placeholder="6-Digit OTP"
            maxLength="6"
            required
          />
        </div>
        <div className="d-grid">
          <button className="btn btn-primary" type="submit">
            Verify Account
          </button>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default EmailVerificationPage;