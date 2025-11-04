import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    // Automatically close the notification after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`} onClick={onClose}>
      <p>{message}</p>
      <div className="notification-timer"></div>
    </div>
  );
};
// In App.jsx, PASTE this new layout component

// In App.jsx, PASTE this corrected layout component

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const getLinkClass = (path) => {
    return location.pathname === path
      ? "admin-sidebar-link active"
      : "admin-sidebar-link";
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3 className="admin-sidebar-title">Admin Panel</h3>
        <nav className="admin-sidebar-nav">
          <Link
            to="/admin/dashboard"
            className={getLinkClass("/admin/dashboard")}
          >
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span> {/* <-- Wrap text in <span> */}
          </Link>
          <Link to="/admin/users" className={getLinkClass("/admin/users")}>
            <i className="bi bi-people-fill"></i>
            <span>User Management</span> {/* <-- Wrap text in <span> */}
          </Link>
          <Link
            to="/admin/products"
            className={getLinkClass("/admin/products")}
          >
            <i className="bi bi-box-seam-fill"></i>
            <span>Product Management</span> {/* <-- Wrap text in <span> */}
          </Link>
          <Link to="/admin/issues" className={getLinkClass("/admin/issues")}>
            <i className="bi bi-shield-fill-exclamation"></i>
            <span>Support Issues</span> {/* <-- Wrap text in <span> */}
          </Link>
        </nav>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
};
export default Notification;