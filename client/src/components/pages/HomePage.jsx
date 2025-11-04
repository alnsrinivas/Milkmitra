import React from 'react';
import { Link } from 'react-router-dom';
const HomePage = () => (
  <>
    {" "}
    <div className="carousel-container mx-auto my-4">
      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
          ></button>
        </div>{" "}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/images/coverc.jpg"
              className="d-block w-100"
              alt="Dairy products"
            />
          </div>
          <div className="carousel-item">
            <img
              src="/images/mm3.jpg"
              className="d-block w-100"
              alt="Pouring milk"
            />
          </div>
          <div className="carousel-item">
            <img
              src="/images/mm2.jpg"
              className="d-block w-100"
              alt="Cows in a field"
            />
          </div>
        </div>{" "}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>{" "}
      </div>
    </div>{" "}
    <section id="About" className="text-center container">
      <h1 className="section-title">About Milk Mitra</h1>
      <p className="section-text">
        A revolutionary initiative connecting dairy farmers directly with
        consumers, eliminating middlemen.
      </p>
    </section>{" "}
    <section id="Products" className="container">
      <h1 className="section-title text-center">Our Products</h1>
      <div className="product-list">
        <div className="product-item">
          <span className="material-symbols-outlined product-icon">
            local_drink
          </span>
          <h5>Fresh Cow Milk</h5>
          <p>Pure, unadulterated cow milk, delivered fresh from the farm.</p>
        </div>
        <div className="product-item">
          <span className="material-symbols-outlined product-icon">
            water_drop
          </span>
          <h5>Fresh Buffalo Milk</h5>
          <p>Rich and creamy buffalo milk, perfect for traditional recipes.</p>
        </div>
        <div className="product-item">
          <span className="material-symbols-outlined product-icon">spa</span>
          <h5>Organic Cow Milk</h5>
          <p>From cows raised on organic feed, ensuring the purest quality.</p>
        </div>
        <div className="product-item">
          <span className="material-symbols-outlined product-icon">spa</span>
          <h5>Organic Buffalo Milk</h5>
          <p>
            From Buffalo raised on organic feed, ensuring the purest quality.
          </p>
        </div>
      </div>
    </section>
    <section className="cta-buttons container">
      <Link to="/farm-register" className="btn btn-primary">
        Register a Dairy Farm
      </Link>
      <Link to="/products" className="btn btn-secondary">
        Explore Nearby Products
      </Link>
      <Link to="/signup" className="btn btn-secondary">
        Sign Up as a Customer
      </Link>
    </section>{" "}
  </>
);
export default HomePage;