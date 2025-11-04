import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    farms: 0,
    orders: 0,
    openIssues: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    };
    fetchStats();
  }, [token]);

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Dashboard Overview</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.users}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.farms}</div>
          <div className="stat-label">Registered Farms</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.orders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.openIssues}</div>
          <div className="stat-label">Open Support Issues</div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;