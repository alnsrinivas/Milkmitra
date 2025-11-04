import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

const AddProductPage = ({ showNotification }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    unit: "litre",
    type: "Cow Milk",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      showNotification("Product created successfully!");
      navigate("/manage-products");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg">
            <div className="card-body p-4 p-md-5">
              <h3 className="text-center mb-4">Add a New Product</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="price" className="form-label">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="unit" className="form-label">
                      Unit
                    </label>
                    <select
                      className="form-select"
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <option value="litre">Litre</option>
                      <option value="ml">ml</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    Milk Type
                  </label>
                  <select
                    className="form-select"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option>Cow Milk</option>
                    <option>Buffalo Milk</option>
                    <option>Organic Cow Milk</option>
                    <option>Organic Buffalo Milk</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="image" className="form-label">
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="e.g., /images/my-milk.jpg"
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;