import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

const ProfilePage = ({ showNotification }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile({
          username: data.username,
          email: data.email,
          phone: data.phone,
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      showNotification("Profile updated successfully!");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsSaving(false); // Re-enable button
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      showNotification("New passwords do not match.", "error");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      showNotification("Password changed successfully. Please log in again.");
      logout();
      navigate("/login");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="section-title">Manage Your Profile</h1>
      <div className="row g-5">
        {/* Update Profile Details Form */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title mb-4">Your Details</h4>
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="form-control"
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="form-control"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* Change Password Form */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title mb-4">Change Password</h4>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwords.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-warning">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;