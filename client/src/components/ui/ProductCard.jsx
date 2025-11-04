import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart, onSubscribe, justAdded }) => {
  // State to toggle visibility of farmer details
  const [detailsVisible, setDetailsVisible] = useState(false);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-card" style={{ opacity: isOutOfStock ? 0.7 : 1 }}>
      {isOutOfStock && <div className="out-of-stock-badge">OUT OF STOCK</div>}
      <div>
        <div className="product-card-image-container">
          <img
            src={product.image || "/images/images(1).jpeg"}
            alt={product.name}
          />
        </div>
      </div>
      <div className="product-card-content">
        <h3>{product.name}</h3>
        {/* --- PASTE THIS NEW RATING SECTION HERE --- */}
        <div className="product-rating" style={{ marginBottom: "10px" }}>
          {product.reviewCount > 0 ? (
            <>
              <span
                style={{
                  color: "#ffc107",
                  fontSize: "1.1rem",
                  letterSpacing: "1px",
                }}
              >
                {"★".repeat(Math.round(product.averageRating))}
                {"☆".repeat(5 - Math.round(product.averageRating))}
              </span>
              <span className="ms-2 small text-muted">
                {product.averageRating.toFixed(1)} ({product.reviewCount}{" "}
                reviews)
              </span>
            </>
          ) : (
            <span className="small text-muted">No reviews yet</span>
          )}
        </div>
        {/* --- END OF RATING SECTION --- */}
        <p>
          <strong>{product.type || "Milk"}</strong>
          <br />
          {product.description}
        </p>
        {product.distance !== undefined && (
          <div className="product-distance">
            <i className="bi bi-geo-alt-fill"></i>{" "}
            {(product.distance / 1000).toFixed(1)} km Away
          </div>
        )}
        {/* --- NEW FARMER DETAILS SECTION --- */}
        <div
          className="farmer-details"
          style={{
            borderTop: "1px solid #eee",
            paddingTop: "10px",
            marginTop: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <span className="small">
              Sold by: <strong>{product.farm?.farmName || "Local Farm"}</strong>
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setDetailsVisible(!detailsVisible)}
            >
              {detailsVisible ? "Hide Info" : "Show Info"}
            </button>
          </div>

          {detailsVisible && (
            <div className="farmer-info-box">
              <p>
                <strong>Farmer:</strong> {product.farm?.owner?.username}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${product.farm?.owner?.phone}`}>
                  {product.farm?.owner?.phone}
                </a>
              </p>
              <p>
                <strong>Address:</strong> {product.farm?.address}
              </p>
            </div>
          )}
        </div>
        {/* --- END OF NEW SECTION --- */}
      </div>
      <div className="product-card-footer">
        <div className="product-price">
          ₹{product.price}/{product.unit}
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onSubscribe(onSubscribe(product._id))}
            disabled={isOutOfStock}
          >
            Subscribe
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onAddToCart(product)}
            disabled={justAdded || isOutOfStock}
          >
            {justAdded ? "Added! ✔" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;