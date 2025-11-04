import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

function DairyDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    ordersToday: 0,
    revenueToday: 0,
    averageRating: 0,
    activeCustomers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/farms/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (e) {
        console.error("Failed to fetch stats:", e);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="container py-4">
      <div className="action-buttons">
        <Link to="/orders" className="btn btn-primary">
          <i className="bi bi-list-check"></i> Manage Orders
        </Link>
        <Link to="/add-product" className="btn btn-secondary">
          <i className="bi bi-plus-circle"></i> Add New Product
        </Link>
        <Link to="/manage-products" className="btn btn-secondary">
          <i className="bi bi-pencil-square"></i> Manage Products
        </Link>
        <Link to="/ratings" className="btn btn-secondary">
          <i className="bi bi-star"></i> View Ratings
        </Link>
        <Link to="/subscribers" className="btn btn-secondary">
          <i className="bi bi-people-fill"></i> View Subscribers
        </Link>
      </div>
      <div className="stats-grid mb-5">
        <div className="stat-card">
          <div className="stat-number">{stats.ordersToday}</div>
          <div className="stat-label">Orders Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₹{stats.revenueToday.toFixed(2)}</div>
          <div className="stat-label">Revenue Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.averageRating} ★</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activeCustomers}</div>
          <div className="stat-label">Active Customers</div>
        </div>
      </div>
      
      <hr className="my-5" />
    </div>
  );
}

export default DairyDashboardPage;