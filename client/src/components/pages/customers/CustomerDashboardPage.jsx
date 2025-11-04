import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';


const CustomerDashboardPage = () => {
  const { token } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setRecentOrders(data.slice(0, 3)); // Get latest 3
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="dashboard-container">
      <div className="action-buttons">
        <Link to="/products" className="action-btn">
          <i className="bi bi-shop"></i> Browse Products
        </Link>
        <Link to="/my-orders" className="action-btn secondary">
          <i className="bi bi-list-check"></i> My Orders
        </Link>
        <Link to="/track-order" className="action-btn">
          <i className="bi bi-geo-alt"></i> Track Order
        </Link>
        <Link to="/profile" className="action-btn">
          <i className="bi bi-person-circle"></i> Manage Profile
        </Link>
        <Link to="/subscription" className="action-btn secondary">
          <i className="bi bi-calendar-check"></i> Manage Subscription
        </Link>
      </div>
      <div className="dashboard-sections">
        <div className="section-card">
          <h3>
            <i className="bi bi-clock-history"></i> Recent Orders
          </h3>
          <div className="recent-orders-list">
            {loading ? (
              <p>Loading...</p>
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div className="order-item" key={order._id}>
                  <div className="order-info">
                    <h5>Order #{order._id.substring(0, 8)}</h5>
                    <p>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`order-status status-${order.status}`}>
                    {order.status}
                  </div>
                </div>
              ))
            ) : (
              <p>No recent orders found.</p>
            )}
          </div>
          <Link
            to="/my-orders"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontWeight: 600,
              marginTop: "15px",
              display: "inline-block",
            }}
          >
            View All Orders →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
