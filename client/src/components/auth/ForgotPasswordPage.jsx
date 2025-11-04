import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthPageLayout from './AuthPageLayout';
import { API_URL } from '../../config/api';

const ForgotPasswordPage = ({ showNotification }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to send reset email.");

      showNotification("Password reset link has been sent to your email.");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageLayout
      imageUrl="/images/img1.jpg"
      imageTitle="Forgot Your Password?"
      imageText="No worries! Enter your email and we'll send you a reset link."
    >
      <h3 className="form-title">Reset Password</h3>
      <p className="text-center" style={{ marginTop: "-1rem" }}>
        Enter the email address associated with your account.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-4">
          <span className="input-group-text">
            <i className="bi bi-envelope"></i>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Your Email Address"
            required
          />
        </div>
        <div className="d-grid">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
        <div className="form-link-text">
          <p>
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default ForgotPasswordPage;