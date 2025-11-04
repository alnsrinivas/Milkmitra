import React, { useState } from 'react';
import { API_URL } from '../../config/api';
const ReviewModal = ({
  show,
  handleClose,
  productId,
  token,
  onReviewSubmit,
  showNotification,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/reviews/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit review.");
      }

      showNotification("Thank you for your review!");
      onReviewSubmit();
      handleClose();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Leave a Review</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="rating" className="form-label">
                  Your Rating
                </label>
                <select
                  id="rating"
                  className="form-select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Your Comment
                </label>
                <textarea
                  id="comment"
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewModal; 