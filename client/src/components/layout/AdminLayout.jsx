import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';
import './AdminLayout.css'; // We will create this CSS file next

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className="admin-nav-link">
            <i className="bi bi-speedometer2"></i> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className="admin-nav-link">
            <i className="bi bi-people-fill"></i> Users
          </NavLink>
          <NavLink to="/admin/products" className="admin-nav-link">
            <i className="bi bi-box-seam"></i> Products
          </NavLink>
          <NavLink to="/admin/issues" className="admin-nav-link">
            <i className="bi bi-shield-fill-exclamation"></i> Issues
          </NavLink>
        </nav>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;