import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { user } = useAuth(); // Get the current user

  return (
    <footer id="Contact-Section">
      <section className="text-center contact-info">
        <p>Have questions? Reach out to us!</p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="alamsrinu01@gmail.com">support@milktmitra.com</a>
        </p>
        <p>
          <strong>Phone:</strong> <a href="tel:+917569189962">+91 7569189962</a>
        </p>
        {/* --- END OF MISSING CONTENT --- */}
      </section>

      {user && ( // Only show the link if a user is logged in
        <div className="text-center mt-4">
          <Link
            to="/contact-support"
            style={{ color: "white", textDecoration: "underline" }}
          >
            Contact Support
          </Link>
        </div>
      )}

      <div className="social-links text-center">
        {/* --- THESE LINKS WERE MISSING --- */}
        <a href="#" aria-label="Facebook">
          <i className="bi bi-facebook"></i>
        </a>
        <a href="#" aria-label="Twitter">
          <i className="bi bi-twitter"></i>
        </a>
        <a href="#" aria-label="Instagram">
          <i className="bi bi-instagram"></i>
        </a>
        {/* --- END OF MISSING LINKS --- */}
      </div>
      <p style={{ marginTop: "20px" }}>
        &copy; 2025 Milk Mitra. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;