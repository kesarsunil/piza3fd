import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { Link } from "react-router-dom";

export default function CartPage2() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff",
        boxShadow: "0 -2px 16px #eee", padding: 32, borderRadius: "24px 24px 0 0",
        maxWidth: 480, margin: "0 auto", textAlign: "center", zIndex: 100
      }}>
        <h2>Your order is confirmed!</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", paddingBottom: 220 }}>
      <div style={{
        maxWidth: 480, margin: "40px auto 0 auto", padding: "0 16px"
      }}>
        <h2 style={{ marginBottom: 16 }}>Your Cart (Bottom Sheet)</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {cartItems.map((item, idx) => (
              <li key={idx} style={{
                background: "#f4f4f4", borderRadius: 8, marginBottom: 12, padding: 12,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: 14, color: "#666" }}>{item.description}</div>
                </div>
                <div style={{ fontWeight: 600 }}>₹{item.price}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Sticky bottom summary */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff",
        boxShadow: "0 -2px 16px #eee", padding: 32, borderRadius: "24px 24px 0 0",
        maxWidth: 480, margin: "0 auto", zIndex: 100
      }}>
        <div style={{ textAlign: "right", fontWeight: 700, fontSize: 18, margin: "0 0 18px 0" }}>
          Total: ₹{total}
        </div>
        <button
          style={{
            width: "100%",
            background: cartItems.length === 0 ? "#ccc" : "#388e3c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "16px 0",
            fontWeight: 700,
            fontSize: 20,
            cursor: cartItems.length === 0 ? "not-allowed" : "pointer"
          }}
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

// ...inside your <Router> and <Routes>:
// <Routes>
//   {/* ...other routes... */}
//   <Route path="/cart2" element={<CartPage2 />} />
// </Routes>
