import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div className="about-container">
    <div className="hero-section">
      <h1>About Milk Mitra</h1>
      <p>
        Connecting dairy farmers directly with consumers for a sustainable,
        transparent, and fair milk supply chain
      </p>
    </div>
    <div className="content-section">
      <h2>Our Story</h2>
      <p>
        Milk Mitra was born out of a simple yet powerful vision: to eliminate
        the middlemen in the dairy supply chain and create a direct connection
        between dairy farmers and consumers.
      </p>
      <h3>Our Mission</h3>
      <p>
        To revolutionize the dairy industry by creating a transparent, fair, and
        sustainable ecosystem where farmers receive fair compensation for their
        produce.
      </p>
    </div>{" "}
    <div className="features-grid">
      <div className="feature-card">
        <div className="feature-icon">
          <i className="bi bi-shield-check"></i>
        </div>
        <h4>Quality Assurance</h4>
        <p>
          Every drop of milk undergoes rigorous quality testing to ensure it
          meets the highest standards of purity and freshness.
        </p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">
          <i className="bi bi-truck"></i>
        </div>
        <h4>Fresh Delivery</h4>
        <p>
          Milk is delivered fresh from the farm to your doorstep within hours of
          milking, ensuring maximum freshness.
        </p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">
          <i className="bi bi-heart"></i>
        </div>
        <h4>Fair Trade</h4>
        <p>
          We ensure farmers receive fair prices for their produce, promoting
          sustainable farming practices.
        </p>
      </div>
    </div>
    <div className="cta-section">
      <h2>Join the Milk Mitra Family</h2>
      <p>
        Whether you're a dairy farmer or a customer, we invite you to be part of
        our journey.
      </p>
      <div className="cta-buttons">
        <Link to="/farm-register" className="btn btn-primary">
          Register Your Farm
        </Link>
        <Link to="/signup" className="btn btn-secondary">
          Sign Up as Customer
        </Link>
      </div>
    </div>{" "}
  </div>
);

export default AboutPage;