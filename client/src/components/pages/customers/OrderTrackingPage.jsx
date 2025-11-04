import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

const OrderTrackingPage = () => {
  const { token } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError("Please enter an order ID.");
      return;
    }
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`${API_URL}/orders/${orderId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not find the order.");
      }
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTimeline = () => {
    if (!order) return null;

    const statuses = [
      "pending",
      "confirmed",
      "processing",
      "out for delivery",
      "delivered",
    ];
    const statusDetails = {
      pending: {
        title: "Order Placed",
        description: "Your order has been successfully placed.",
      },
      confirmed: {
        title: "Order Confirmed",
        description: "The farm has confirmed your order.",
      },
      processing: {
        title: "Processing",
        description: "Your milk is being prepared and packaged.",
      },
      "out for delivery": {
        title: "Out for Delivery",
        description: "Your order is on its way to you.",
      },
      delivered: {
        title: "Delivered",
        description: "Your order has been delivered successfully.",
      },
    };
    const currentStatusIndex = statuses.indexOf(order.status);

    return (
      <div className="tracking-timeline">
        {statuses.map((status, index) => {
          let itemClass = "pending";
          if (index < currentStatusIndex) itemClass = "completed";
          if (index === currentStatusIndex) itemClass = "current";

          return (
            <div className="timeline-item" key={status}>
              <div className={`timeline-icon ${itemClass}`}>
                <i
                  className={`bi ${
                    itemClass === "completed" ? "bi-check" : "bi-truck"
                  }`}
                ></i>
              </div>
              <div className="timeline-content">
                <h4>{statusDetails[status].title}</h4>
                <p>{statusDetails[status].description}</p>
                {index === currentStatusIndex && (
                  <small>{new Date(order.updatedAt).toLocaleString()}</small>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="tracking-container">
      <div className="tracking-header">
        <h1>Track Your Order</h1>
        <p>Monitor the status of your milk delivery in real-time</p>
      </div>
      <div className="search-section">
        <form className="search-form" onSubmit={handleTrackOrder}>
          <input
            type="text"
            className="search-input"
            placeholder="Enter your order ID..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </form>
      </div>

      <div className="order-details" style={{ marginTop: "2rem" }}>
        {error && <p className="text-center text-danger">{error}</p>}
        {order && (
          <>
            <h3 className="text-center mb-4">
              Order #{order._id.substring(0, 8)}
            </h3>
            {renderTimeline()}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;