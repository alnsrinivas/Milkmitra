import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import ProductCard from "../ui/ProductCard";

const ProductsPage = ({ onAddToCart, searchQuery, showNotification }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(null);
  const navigate = useNavigate();

  // --- NEW STATE FOR FILTERS ---
  const [milkType, setMilkType] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [userLocation, setUserLocation] = useState(null);

  const handleSubscribe = (productId) => {
    // 1. Find the full product object from the state array
    const productToSubscribe = products.find((p) => p._id === productId);

    if (!productToSubscribe) {
      showNotification(
        "Could not find product details for subscription.",
        "error"
      );
      return;
    }

    // 2. Navigate, passing the full product data in the state
    navigate("/subscription", { state: { product: productToSubscribe } });
  };
  const handleProductAddToCart = (product) => {
    onAddToCart(product);
    setJustAdded(product._id);
    setTimeout(() => setJustAdded(null), 1500);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          showNotification(
            "Could not get your location. Showing all products.",
            "error"
          );
          setUserLocation({ latitude: null, longitude: null }); // Fallback
        }
      );
    } else {
      showNotification(
        "Geolocation is not supported. Showing all products.",
        "error"
      );
    }
  }, []); // Empty array ensures this runs only once

  // Effect to fetch products whenever filters OR location change
  // In App.jsx, inside the ProductsPage component

  useEffect(() => {
    if (userLocation === null) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL(`${API_URL}/products`);
        url.searchParams.append("type", milkType);
        url.searchParams.append("sort", sortBy);

        // Add search query and location to the request
        if (searchQuery) url.searchParams.append("q", searchQuery);
        if (userLocation.latitude)
          url.searchParams.append("lat", userLocation.latitude);
        if (userLocation.longitude)
          url.searchParams.append("lon", userLocation.longitude);

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Geolocation error:", error);
        showNotification(
          "Could not get your location. Showing all products.",
          "error"
        );
        setUserLocation({ latitude: null, longitude: null });
      } finally {
        setLoading(false);
      }
    };

    // Use a timeout to prevent sending an API request on every single keystroke
    const debounceFetch = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms delay

    return () => clearTimeout(debounceFetch); // Cleanup the timeout
  }, [milkType, sortBy, userLocation, searchQuery]); // Add searchQuery to the dependency array // Re-run if location is found
  // --- REMOVED frontend filtering logic, as the backend will handle it ---

  return (
    <section className="container">
      <div className="products-hero">
        <h1>Pure Farm Fresh Milk</h1>
        <p>
          Premium quality milk from happy, healthy cows and Buffaloes -
          delivered fresh daily
        </p>
      </div>

      <div className="filter-bar">
        <div className="form-bar-item">
          <label htmlFor="milkType" className="form-label fw-bold">
            Milk Type
          </label>
          {/* --- WIRED UP THE DROPDOWN --- */}
          <select
            id="milkType"
            className="form-select"
            value={milkType}
            onChange={(e) => setMilkType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Cow Milk">Cow Milk</option>
            <option value="Buffalo Milk">Buffalo Milk</option>
            <option value="Organic Cow Milk">Organic Cow Milk</option>
            <option value="Organic Buffalo Milk">Organic Buffalo Milk</option>
          </select>
        </div>
        <div className="filter-bar-item">
          <label htmlFor="sortBy" className="form-label fw-bold">
            Sort By
          </label>
          {/* --- WIRED UP THE DROPDOWN --- */}
          <select
            id="sortBy"
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleProductAddToCart} // Corrected this prop
              onSubscribe={() => handleSubscribe(product._id)}
              justAdded={justAdded === product._id}
            />
          ))
        ) : (
          <p>No products match your criteria. Please check back later.</p>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
