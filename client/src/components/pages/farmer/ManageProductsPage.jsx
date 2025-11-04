import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';
import EditProductModal from '../../ui/EditProductModal';

const ManageProductsPage = ({ showNotification }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  // State for the modal
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // We'll show 5 products per page
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products/myproducts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch your products.");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleProductUpdated = (updatedProduct) => {
    // Refresh the product list with the updated data
    setProducts(
      products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };
  // --- ADD THIS NEW FUNCTION ---
  const handleToggleStock = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}/stock`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to update stock status.");
      const updatedProduct = await res.json();
      // Update the product list in the state to reflect the change immediately
      setProducts(
        products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
      showNotification("Stock status updated successfully.");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setUpdatingId(null); // Clear the ID when the operation is done
    }
  };
  // --- END OF NEW FUNCTION ---
  const handleDelete = async (productId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product.");
      // Remove the product from the state to update the UI
      setProducts(products.filter((p) => p._id !== productId));
      showNotification("Product deleted successfully.");
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setUpdatingId(null); // Clear the ID when the operation is done
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  if (loading)
    return <p className="text-center mt-5">Loading your products...</p>;
  if (error)
    return <p className="text-center text-danger mt-5">Error: {error}</p>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1
          className="section-title"
          style={{ textAlign: "left", marginBottom: 0 }}
        >
          Manage Your Products
        </h1>
        <Link to="/add-product" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>
          You have not added any products yet. Click the button above to get
          started.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image || "/images/images(2).png"}
                      alt={product.name}
                      className="table-product-image"
                    />
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>
                    {product.stock > 0 ? (
                      <span className="badge bg-success">In Stock</span>
                    ) : (
                      <span className="badge bg-danger">Out of Stock</span>
                    )}
                  </td>
                  <td>
                    ₹{product.price}/{product.unit}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleToggleStock(product._id)}
                    >
                      {product.stock > 0
                        ? "Mark as Sold Out"
                        : "Mark as In Stock"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEditClick(product)}
                      disabled={updatingId === product._id}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(product._id)}
                      disabled={updatingId === product._id}
                    >
                      {updatingId === product._id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages).keys()].map((number) => (
              <li
                key={number + 1}
                className={`page-item ${
                  currentPage === number + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(number + 1)}
                >
                  {number + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
      <EditProductModal
        show={showModal}
        product={editingProduct}
        onClose={handleModalClose}
        onProductUpdated={handleProductUpdated}
        token={token}
        showNotification={showNotification}
      />
    </div>
  );
};


export default ManageProductsPage;