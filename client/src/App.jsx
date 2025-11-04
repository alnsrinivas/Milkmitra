import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { API_URL } from './config/api';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
// Reusable Components
import ProductCard from './components/ui/ProductCard';
import Notification from './components/ui/Notification';
import ReviewModal from './components/ui/ReviewModal';
import EditProductModal from "./components/ui/EditProductModal";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProductsPage from "./components/pages/ProductsPage";
//Auth Pages
import LoginPage from './components/auth/LoginPage';
import SignUpPage from "./components/auth/SignUpPage";
import FarmRegistrationPage from "./components/auth/FarmRegistrationPage";
import FarmLoginPage from "./components/auth/FarmLoginPage";
import EmailVerificationPage from "./components/auth/EmailVerificationPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import AuthPageLayout from "./components/auth/AuthPageLayout";
//Layout Pages
import HomePage from './components/pages/HomePage';
import AboutPage from "./components/pages/AboutPage";
import CartPage from "./components/pages/CartPage";
import PaymentPage from "./components/pages/PaymentPage";
import ProfilePage from "./components/pages/ProfilePage";
import ContactSupportPage from "./components/pages/ContactSupportPage";
//Customer Pages
import CustomerDashboardPage from "./components/pages/customers/CustomerDashboardPage";
import MyOrdersPage from "./components/pages/customers/MyOrdersPage";
import OrderTrackingPage from "./components/pages/customers/OrderTrackingPage";
import SubscriptionPage from "./components/pages/customers/SubscriptionPage";
//Farmer Pages
import DairyDashboardPage from "./components/pages/farmer/DairyDashboardPage";
import AddProductPage from "./components/pages/farmer/AddProductPage";
import ManageProductsPage from "./components/pages/farmer/ManageProductsPage";
import OrderManagementPage from "./components/pages/farmer/OrderManagementPage";
import RatingsPage from "./components/pages/farmer/RatingsPage";
import SubscribersPage from "./components/pages/farmer/SubscribersPage";
//Admin Pages
import AdminDashboardPage from "./components/pages/admin/AdminDashboardPage";
import AdminUsersPage from "./components/pages/admin/AdminUsersPage";
import AdminProductsPage from "./components/pages/admin/AdminProductsPage";
import AdminIssuesPage from "./components/pages/admin/AdminIssuesPage";

const ScrollToTop = () => {
  // Extracts pathname property from location object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component does not render anything
};

const CustomerBrowseRoute = ({ children, showNotification }) => {
  const { user } = useAuth();

  // If the user is a farmer, redirect them to their dashboard
  if (user && user.role === "farmer") {
    showNotification(
      "This page is for customers. Redirecting to your dashboard.",
      "error"
    );
    return <Navigate to="/dashboard/dairy" replace />;
  }

  // If the user is an admin, redirect them to their dashboard
  if (user && user.role === "admin") {
    showNotification(
      "This page is for customers. Redirecting to the admin panel.",
      "error"
    );
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Otherwise, if the user is a customer or not logged in, show the page
  return children;
};

// --- Main App Component ---
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification({ message: "", type: "" });
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleAddToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item._id === productToAdd._id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === productToAdd._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
  };
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };
  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        {notification.message && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
        <Navbar
          cartCount={cartCount}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/products"
              element={
                <CustomerBrowseRoute showNotification={showNotification}>
                  <ProductsPage
                    onAddToCart={handleAddToCart}
                    searchQuery={searchQuery}
                    showNotification={showNotification}
                  />{" "}
                </CustomerBrowseRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleClearCart}
                />
              }
            />
            <Route
              path="/login"
              element={<LoginPage showNotification={showNotification} />}
            />
            <Route
              path="/signup"
              element={<SignUpPage showNotification={showNotification} />}
            />
            <Route
              path="/farm-register"
              element={
                <FarmRegistrationPage showNotification={showNotification} />
              }
            />
            <Route
              path="/farm-login"
              element={<FarmLoginPage showNotification={showNotification} />}
            />
            <Route
              path="/verify-email"
              element={
                <EmailVerificationPage showNotification={showNotification} />
              }
            />

            {/* In App.jsx, inside your <Routes>, replace the old protected routes with these */}

            {/* Protected Routes */}
            <Route
              path="/contact-support"
              element={
                <ProtectedRoute showNotification={showNotification}>
                  <ContactSupportPage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute
                  role="admin"
                  showNotification={showNotification}
                >
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute
                  role="admin"
                  showNotification={showNotification}
                >
                  <AdminUsersPage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute
                  role="admin"
                  showNotification={showNotification}
                >
                  <AdminProductsPage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/issues"
              element={
                <ProtectedRoute
                  role="admin"
                  showNotification={showNotification}
                >
                  <AdminIssuesPage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />

            {/* Customer routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute showNotification={showNotification}>
                  <ProfilePage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/customer"
              element={
                <ProtectedRoute
                  role="customer"
                  showNotification={showNotification}
                >
                  <CustomerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute
                  role="customer"
                  showNotification={showNotification}
                >
                  <MyOrdersPage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute
                  role="customer"
                  showNotification={showNotification}
                >
                  <SubscriptionPage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute
                  role="customer"
                  showNotification={showNotification}
                >
                  <PaymentPage
                    onClearCart={handleClearCart}
                    showNotification={showNotification}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/track-order"
              element={
                <ProtectedRoute
                  role="customer"
                  showNotification={showNotification}
                >
                  <OrderTrackingPage />
                </ProtectedRoute>
              }
            />

            {/* Farmer routes */}
            <Route
              path="/dashboard/dairy"
              element={
                <ProtectedRoute
                  role="farmer"
                  showNotification={showNotification}
                >
                  <DairyDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute
                  role="farmer"
                  showNotification={showNotification}
                >
                  <OrderManagementPage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ratings"
              element={
                <ProtectedRoute
                  role="farmer"
                  showNotification={showNotification}
                >
                  <RatingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <ProtectedRoute
                  role="farmer"
                  showNotification={showNotification}
                >
                  <AddProductPage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-products"
              element={
                <ProtectedRoute
                  role="farmer"
                  showNotification={showNotification}
                >
                  <ManageProductsPage showNotification={showNotification} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscribers"
              element={
                <ProtectedRoute
                  role="farmer"
                  showNotification={showNotification}
                >
                  <SubscribersPage />
                </ProtectedRoute>
              }
            />

            {/* Password Reset Route (already public but good to keep it grouped) */}
            <Route
              path="/reset-password/:token"
              element={
                <ResetPasswordPage showNotification={showNotification} />
              }
            />
            <Route
              path="/verify-email"
              element={
                <EmailVerificationPage showNotification={showNotification} />
              }
            />
            <Route
              path="/forgot-password"
              element={
                <ForgotPasswordPage showNotification={showNotification} />
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
