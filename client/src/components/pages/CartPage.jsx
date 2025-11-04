import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CartPage = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!user) {
      alert("Please log in to proceed to checkout.");
      navigate("/login");
      return;
    }

    navigate("/payment", {
      state: {
        items: cartItems,
        totalAmount: totalCost,
      },
    });
  };

  return (
    <div className="container">
      <div className="cart-page-container">
        <h1>Your Shopping Cart 🛒</h1>
        {cartItems.length === 0 ? (
          <div id="empty-cart-message">
            <p>
              Your cart is empty. <Link to="/products">Go find some milk!</Link>
            </p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ₹{item.price}</p>
                </div>
                <div className="item-controls">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      onUpdateQuantity(item._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="item-quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      onUpdateQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="item-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => onRemoveItem(item._id)}
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              </div>
            ))}
            <div className="cart-summary">
              <h2>Total: ₹{totalCost.toFixed(2)}</h2>
              <button className="btn btn-primary" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default CartPage;