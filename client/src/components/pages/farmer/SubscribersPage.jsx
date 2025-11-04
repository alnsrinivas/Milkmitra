import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config/api';

const SubscribersPage = () => {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/subscriptions/farm`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch subscribers.");
        const data = await res.json();
        setSubscribers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, [token]);

  if (loading)
    return <p className="text-center mt-5">Loading your subscribers...</p>;
  if (error)
    return <p className="text-center text-danger mt-5">Error: {error}</p>;

  return (
    <div className="container my-5">
      <h1 className="section-title">Your Subscribers</h1>

      {subscribers.length === 0 ? (
        <p className="text-center">
          You do not have any active subscribers yet.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subscribed Plan</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub._id}>
                  <td>
                    <strong>{sub.customer.username}</strong>
                  </td>
                  <td>{sub.customer.email}</td>
                  <td>{sub.customer.phone}</td>
                  <td>{sub.plan}</td>
                  <td>{new Date(sub.startDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubscribersPage;