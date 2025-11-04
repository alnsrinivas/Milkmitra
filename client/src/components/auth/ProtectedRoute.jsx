import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role, showNotification }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    showNotification("You must be logged in to view this page.", "error");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    showNotification(`Access Denied. This page is for ${role}s only.`, "error");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

