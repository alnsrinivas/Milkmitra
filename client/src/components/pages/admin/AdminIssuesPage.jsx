import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

const AdminIssuesPage = ({ showNotification }) => {
  const { token } = useAuth();
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    const res = await fetch(`${API_URL}/admin/issues`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setIssues(await res.json());
  };

  useEffect(() => {
    fetchIssues();
  }, [token]);

  const handleStatusChange = async (issueId, newStatus) => {
    const res = await fetch(`${API_URL}/admin/issues/${issueId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      showNotification("Issue status updated.");
      fetchIssues();
    } else {
      showNotification("Failed to update status.", "error");
    }
  };

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Support Issues</h1>
      <div className="table-responsive">
        <table className="table">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.user.username}</td>
                <td>{issue.subject}</td>
                <td>{issue.status}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={issue.status}
                    onChange={(e) =>
                      handleStatusChange(issue._id, e.target.value)
                    }
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
export default AdminIssuesPage;