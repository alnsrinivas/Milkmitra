import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ cartCount, searchQuery, onSearchChange }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu

  return (
    <nav>
      <div id="logo_base">
        <Link
          to="/"
          className="d-flex align-items-center text-decoration-none gap-2"
        >
          <img src="/images/logoc.jpeg" id="logo" alt="Milk Mitra Logo" />
          <h2 id="logo_txt">Milk Mitra</h2>
        </Link>
      </div>

      {/* Hamburger Button - visible only on mobile */}
      <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Navigation Links with new class for mobile behavior */}
      <div id="nav_base" className={isMenuOpen ? "active" : ""}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        <Link to="/about" onClick={() => setIsMenuOpen(false)}>
          About
        </Link>
        <Link to="/products" onClick={() => setIsMenuOpen(false)}>
          Products
        </Link>
        {user?.role === "customer" && (
          <Link to="/dashboard/customer" onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
        )}
        {user?.role === "farmer" && (
          <Link to="/dashboard/dairy" onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
            Admin Panel
          </Link>
        )}
      </div>

      {/* Right-side icons remain separate */}
      <div className="nav-right">
        <div id="search_base">
          <span className="material-symbols-outlined" id="search_icon">
            search
          </span>
          <input
            type="text"
            id="search"
            placeholder="Search for milk..."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        <Link
          to="/cart"
          className="btn btn-link text-decoration-none position-relative"
        >
          <i className="bi bi-cart fs-3" style={{ color: "#555" }}></i>
          {cartCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cartCount}
            </span>
          )}
        </Link>
        {user ? (
          <>
            <span className="navbar-text me-2">Hi, {user.username}</span>
            <Link
              to="/profile"
              className="btn btn-link text-decoration-none"
              title="My Profile"
            >
              <i
                className="bi bi-person-gear fs-3"
                style={{ color: "#555" }}
              ></i>
            </Link>
            <button
              onClick={logout}
              className="btn btn-outline-danger btn-sm"
              title="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="btn btn-link text-decoration-none"
            title="Login / Sign Up"
          >
            <i
              className="bi bi-person-circle fs-3"
              style={{ color: "#555" }}
            ></i>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;