import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

const AdminUsersPage = ({ showNotification }) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDelete = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This is irreversible."
      )
    )
      return;
    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showNotification("User removed successfully.");
      fetchUsers();
    } else {
      showNotification("Failed to remove user.", "error");
    }
  };

  return (
    <AdminLayout>
      <h1 className="admin-page-title">User Management</h1>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge bg-${
                      user.role === "admin"
                        ? "danger"
                        : user.role === "farmer"
                        ? "success"
                        : "primary"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.role !== "admin" && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;