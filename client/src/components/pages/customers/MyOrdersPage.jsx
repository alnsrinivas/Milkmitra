import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';
import ReviewModal from '../../ui/ReviewModal';

const MyOrdersPage = ({ showNotification }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not fetch orders.");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleOpenModal = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProductId(null);
    setShowModal(false);
  };
  const handleCopy = (orderId) => {
    navigator.clipboard.writeText(orderId);
    showNotification("Order ID copied to clipboard!");
  };
  return (
    <div className="container my-5">
      <h1 className="section-title">My Orders</h1>
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
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
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={`order-status status-${order.status}`}>
                  {order.status}
                </div>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div className="order-item-detail" key={item.product._id}>
                    <span className="item-name">
                      {item.product.name} (x{item.quantity})
                    </span>
                    {order.status === "delivered" && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleOpenModal(item.product._id)}
                      >
                        Leave a Review
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <ReviewModal
        show={showModal}
        handleClose={handleCloseModal}
        productId={selectedProductId}
        token={token}
        onReviewSubmit={fetchOrders}
        showNotification={showNotification}
      />
    </div>
  );
};

export default MyOrdersPage;