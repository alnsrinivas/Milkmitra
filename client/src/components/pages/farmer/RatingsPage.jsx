import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';


const RatingsPage = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let fiveStarPercentage = 0;
  if (totalReviews > 0) {
    reviews.forEach((review) => {
      if (ratingDistribution[review.rating] !== undefined) {
        ratingDistribution[review.rating]++;
      }
    });
    fiveStarPercentage = ((ratingDistribution[5] / totalReviews) * 100).toFixed(
      0
    );
  }
  // END OF PASTE

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews/farm`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch reviews.");
        }

        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReviews();
    }
  }, [token]);

  return (
    <div className="ratings-container">
      <div className="ratings-header">
        <h1>Customer Reviews & Ratings</h1>
        <p>See what your customers are saying</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{averageRating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalReviews}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{fiveStarPercentage}%</div>
          <div className="stat-label">5-Star Reviews</div>
        </div>
      </div>
      <div className="rating-breakdown">
        <h3>Rating Distribution</h3>
        {Object.keys(ratingDistribution)
          .sort((a, b) => b - a)
          .map((star) => (
            <div className="rating-bar" key={star}>
              <div className="rating-label">{star}★</div>
              <div className="rating-progress">
                <div
                  className="rating-fill"
                  style={{
                    width: `${
                      totalReviews > 0
                        ? (ratingDistribution[star] / totalReviews) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="rating-count">{ratingDistribution[star]}</div>
            </div>
          ))}
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h3>Customer Reviews</h3>
        </div>

        {loading && <p>Loading reviews...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && reviews.length === 0 && (
          <p>You have not received any reviews yet.</p>
        )}

        {!loading &&
          !error &&
          reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <div className="review-header">
                <div className="customer-info">
                  <div className="customer-avatar">
                    {review.customer.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="customer-details">
                    <h5>{review.customer.username}</h5>
                    <p>Verified Customer</p>
                  </div>
                </div>
                <div className="stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <p>{review.comment}</p>
              <small style={{ color: "#666" }}>
                Product: {review.product.name} | Date:{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RatingsPage;