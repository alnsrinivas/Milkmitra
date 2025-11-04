import React, { useState,useEffect } from 'react';
import { API_URL } from '../../config/api';

const EditProductModal = ({
  product,
  show,
  onClose,
  onProductUpdated,
  token,
  showNotification,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // When the product prop changes, update the form data
    setFormData(product || {});
  }, [product]);

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update product");
      const updatedProduct = await res.json();
      onProductUpdated(updatedProduct); // Pass updated data back to parent
      onClose(); // Close the modal
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Product: {product.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    className="form-control"
                    name="unit"
                    value={formData.unit || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={formData.image || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProductModal;