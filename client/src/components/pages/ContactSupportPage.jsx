import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';


const ContactSupportPage = ({ showNotification }) => {
  const { token } = useAuth();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subject, description }),
    });

    if (res.ok) {
      showNotification("Your support ticket has been submitted.");
      navigate("/");
    } else {
      showNotification("Failed to submit ticket. Please try again.", "error");
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="section-title">Contact Support</h1>
          <p className="text-center">
            Have an issue? Please fill out the form below and we'll get back to
            you.
          </p>
          <form onSubmit={handleSubmit} className="card p-4">
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description of Issue</label>
              <textarea
                className="form-control"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSupportPage;