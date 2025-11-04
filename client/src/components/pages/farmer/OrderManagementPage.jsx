import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

const OrderManagementPage = ({ showNotification }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFarmOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders/farm`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch orders.");
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFarmOrders();
    }
  }, [token]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order status.");
      }
      fetchFarmOrders();
      showNotification(`Order status updated to ${newStatus}.`);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch = filter === "all" || order.status === filter;
    if (!order.customer) return false; // Safety check
    const searchMatch =
      order.customer.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });
  const handleCopy = (orderId) => {
    navigator.clipboard.writeText(orderId);
    showNotification("Order ID copied to clipboard!");
  };
  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <p>Track and manage all your farm orders</p>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by order ID or customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filter-tabs">
        <button
          onClick={() => setFilter("all")}
          className={`filter-tab ${filter === "all" && "active"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`filter-tab ${filter === "pending" && "active"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          className={`filter-tab ${filter === "confirmed" && "active"}`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilter("processing")}
          className={`filter-tab ${filter === "processing" && "active"}`}
        >
          Processing
        </button>
        <button
          onClick={() => setFilter("delivered")}
          className={`filter-tab ${filter === "delivered" && "active"}`}
        >
          Delivered
        </button>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className="orders-grid">
        {!loading &&
          !error &&
          filteredOrders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div>
                  <div className="order-id">
                    Order #{order._id.substring(0, 8)}
                    <button
                      onClick={() => handleCopy(order._id)}
                      className="btn btn-sm btn-link"
                      title="Copy full Order ID"
                    >
                      <i className="bi bi-clipboard"></i>
                    </button>
                  </div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className={`order-status status-${order.status}`}>
                  {order.status}
                </div>
              </div>
              <div className="order-details">
                <div className="customer-info" style={{ marginTop: "10px" }}>
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>{order.deliveryAddress}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-item-detail" key={item.product._id}>
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-quantity">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <span>Total Amount:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="order-actions">
                {order.status === "pending" && (
                  <button
                    className="action-btn-sm btn-confirm"
                    onClick={() => handleUpdateStatus(order._id, "confirmed")}
                  >
                    Confirm
                  </button>
                )}
                {order.status === "confirmed" && (
                  <button
                    className="action-btn-sm btn-process"
                    onClick={() => handleUpdateStatus(order._id, "processing")}
                  >
                    Process
                  </button>
                )}
                {order.status === "processing" && (
                  <button
                    className="action-btn-sm btn-deliver"
                    onClick={() =>
                      handleUpdateStatus(order._id, "out for delivery")
                    }
                  >
                    Out for Delivery
                  </button>
                )}
                {order.status === "out for delivery" && (
                  <button
                    className="action-btn-sm btn-success"
                    onClick={() => handleUpdateStatus(order._id, "delivered")}
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        {!loading && !error && filteredOrders.length === 0 && (
          <p>No orders match the current filter.</p>
        )}
      </div>
    </div>
  );
};

export default OrderManagementPage;