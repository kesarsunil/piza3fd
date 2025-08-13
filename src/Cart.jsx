import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div
        style={{
          maxWidth: 420,
          margin: "60px auto",
          background: "linear-gradient(135deg, #f8fafc 0%, #e9f5ff 100%)",
          borderRadius: 18,
          boxShadow: "0 4px 24px #e0e7ef",
          padding: "40px 32px 32px 32px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#388e3c", marginBottom: 24 }}>
          Your order is confirmed!
        </h2>
        <Link to="/">
          <button
            style={{
              marginTop: 12,
              background: "#646cff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px #e0e7ef",
            }}
          >
            Back to Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "60px auto",
        background: "linear-gradient(135deg, #f8fafc 0%, #e9f5ff 100%)",
        borderRadius: 18,
        boxShadow: "0 4px 24px #e0e7ef",
        padding: "40px 32px 32px 32px",
        minHeight: 340,
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#222",
          marginBottom: 28,
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        Your Cart
      </h1>
      {cartItems.length === 0 ? (
        <p
          style={{
            color: "#888",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          No items in cart.
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginBottom: 32,
          }}
        >
          {cartItems.map((item, idx) => (
            <li
              key={idx}
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "14px 18px",
                marginBottom: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 1px 4px #e0e7ef",
              }}
            >
              <span style={{ fontWeight: 600, color: "#222" }}>{item.name}</span>
              <span
                style={{
                  color: "#888",
                  fontSize: 15,
                  marginLeft: 16,
                }}
              >
                {item.description}
              </span>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={handlePlaceOrder}
        disabled={cartItems.length === 0}
        style={{
          width: "100%",
          background: cartItems.length === 0 ? "#ccc" : "#388e3c",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "14px 0",
          fontWeight: 700,
          fontSize: 18,
          cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
          boxShadow: "0 2px 8px #e0e7ef",
          marginBottom: 18,
        }}
      >
        Place Order
      </button>
      <div
        style={{
          textAlign: "center",
          marginTop: 10,
        }}
      >
        <Link
          to="/"
          style={{
            color: "#646cff",
            textDecoration: "underline",
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}