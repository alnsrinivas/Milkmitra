import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';
import { useLocation } from 'react-router-dom';

const SubscriptionPage = ({ showNotification }) => {
  const { token } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("Premium Plan");
  const location = useLocation();
  const product = location.state?.product;
  const [productName, setProductName] = useState(product?.name || "No Product Selected");

  // Function to fetch the user's current subscription
  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/subscriptions/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
        if(data.product && data.product.name) {
            setProductName(data.product.name);
        }
      } else {
        setSubscription(null); // No subscription found
      }
    } catch (error) {
      console.error("Failed to fetch subscription", error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubscription();
    }
  }, [token]);

  // Function to handle creating or updating a subscription
  const handleSelectPlan = async () => {
    if (!product?._id) {
        showNotification("Subscription failed: Product details are missing.", "error");
        return;
    }
    try {
      const res = await fetch(`${API_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: selectedPlan,productId: product._id, }),
      });
      if (!res.ok) throw new Error("Failed to update subscription.");
      showNotification(`You are now subscribed to the ${selectedPlan}!`);
      fetchSubscription(); // Refresh subscription status
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  // Function to handle canceling a subscription
  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?"))
      return;
    try {
      const res = await fetch(`${API_URL}/subscriptions/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel subscription.");
      showNotification("Your subscription has been cancelled.");
      fetchSubscription(); // Refresh subscription status
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <p>Loading your subscription details...</p>
      </div>
    );
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>Manage Your Subscription</h1>
        <p>You are currently managing the subscription for: <strong>{productName}</strong></p>
      </div>

      {subscription && subscription.status === "active" ? (
        <div className="current-subscription">
          <div className="subscription-card">
            <div className="subscription-header-card">
              <h3 className="subscription-title">Your Current Plan</h3>
              <span className="subscription-status">Active</span>
            </div>
            <div className="subscription-details">
              <div className="detail-item">
                <div className="detail-label">Product</div>
                <div className="detail-label">Plan</div>
                <div className="detail-value">{subscription.plan}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Member Since</div>
                <div className="detail-value">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="subscription-actions">
              <button
                className="btn btn-danger"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="plans-section">
          <h2 className="text-center">Choose a New Plan for {productName}</h2>
          <div className="plans-grid">
            {/* Plan Card 1 */}
            <div
              className={`plan-card ${
                selectedPlan === "Premium Plan" ? "recommended" : ""
              }`}
              onClick={() => setSelectedPlan("Premium Plan")}
            >
              <h4 className="plan-name">Premium Plan</h4>
              <p className="plan-price">₹2000</p>
              <p className="plan-period">per month</p>
              <ul className="plan-features">
                <li>
                  <i className="bi bi-check-circle-fill"></i> Daily Delivery
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i> Upto 1.5 Litres
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i> Priority Support
                </li>
              </ul>
              <button
                className="btn btn-primary"
                onClick={handleSelectPlan}
                disabled={selectedPlan !== "Premium Plan"}
              >
                {selectedPlan === "Premium Plan" ? "Select Plan" : "Choose"}
              </button>
            </div>
            {/* Plan Card 2 */}
            <div
              className={`plan-card ${
                selectedPlan === "Family Plan" ? "recommended" : ""
              }`}
              onClick={() => setSelectedPlan("Family Plan")}
            >
              <h4 className="plan-name">Family Plan</h4>
              <p className="plan-price">₹3500</p>
              <p className="plan-period">per month</p>
              <ul className="plan-features">
                <li>
                  <i className="bi bi-check-circle-fill"></i> Daily Delivery
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i> Upto 3 Litres
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i> Priority Support
                </li>
              </ul>
              <button
                className="btn btn-primary"
                onClick={handleSelectPlan}
                disabled={selectedPlan !== "Family Plan"}
              >
                {selectedPlan === "Family Plan" ? "Select Plan" : "Choose"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;