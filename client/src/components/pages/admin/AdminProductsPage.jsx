import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

const AdminProductsPage = ({ showNotification }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch all products from the admin endpoint
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products.");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [token]);

  const handleDelete = async (productId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this product?"
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product.");

      showNotification("Product removed successfully.");
      // Refresh the product list after deletion
      fetchAllProducts();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading all products...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Product Management</h1>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Product Name</th>
              <th>Farm Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>{product.farm?.farmName || "N/A"}</td>
                <td>
                  ₹{product.price}/{product.unit}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;