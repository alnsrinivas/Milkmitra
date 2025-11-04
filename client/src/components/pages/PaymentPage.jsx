import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';

const PaymentPage = ({ onClearCart, showNotification }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState("");

  const { items, totalAmount } = location.state || {
    items: [],
    totalAmount: 0,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty.");
      navigate("/products");
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      totalAmount: totalAmount,
      deliveryAddress: address,
    };

    try {
      const res = await fetch(`${API_URL}/payments/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error("Payment failed. Please try again.");
      }

      showNotification("Payment successful and order placed!");
      onClearCart();
      navigate("/my-orders");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="section-title">Secure Payment</h1>
        <p>
          Total Amount: <strong>₹{totalAmount.toFixed(2)}</strong>
        </p>
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" placeholder="Srinivas" required />
          </div>
          <div className="form-group">
            <label htmlFor="deliveryAddress">Ph NO. & Delivery Address</label>
            <textarea
              id="deliveryAddress"
              rows="3"
              placeholder="e.g., 7569189962,123  street, ongole, Ap, 523225"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="tel"
              id="cardNumber"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input type="text" id="expiryDate" placeholder="MM/YY" required />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input type="tel" id="cvv" placeholder="123" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-pay">
            Pay Now
          </button>
        </form>
        <Link to="/cart" className="back-link">
          Back to Cart
        </Link>
      </div>
    </div>
  );
};

export default PaymentPage;