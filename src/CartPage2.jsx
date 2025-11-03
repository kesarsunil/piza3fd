import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import AdminButton from "./AdminButton";

export default function CartPage2() {
  const { cartItems, placeOrder, confirmOrder } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const handlePlaceOrder = () => {
    // Build items list for confirmation
    const itemsList = cartItems.map((item, idx) => 
      `${idx + 1}. ${item.name} - ₹${item.price}\n   ${item.description || 'No toppings'}`
    ).join('\n\n');
    
    // Show confirmation dialog with ALL cart items
    const confirmMessage = 
      '🛒 CONFIRM YOUR ORDER\n\n' +
      '📦 You are about to place an order with the following items:\n\n' +
      itemsList + '\n\n' +
      '📊 Order Summary:\n' +
      `   • Total Items: ${cartItems.length}\n` +
      `   • Total Amount: ₹${total}\n` +
      `   • Customer: ${currentUser}\n\n` +
      '✅ Click OK to confirm and place this order\n' +
      '❌ Click Cancel to go back and edit cart';
    
    const confirmed = window.confirm(confirmMessage);
    
    if (!confirmed) {
      console.log('❌ User cancelled order placement');
      return;
    }
    
    console.log('✅ User confirmed order with all cart items!');
    
    const orderId = placeOrder({
      customerName: "Customer",
      customerPhone: "1234567890"
    });
    
    // Auto-confirm the order immediately
    setTimeout(() => {
      confirmOrder(orderId);
    }, 100);
    
    setOrderPlaced(true);
    
    // Wait 7 seconds (5s for cart clear + 2s for message) then redirect to home
    setTimeout(() => {
      setOrderPlaced(false);
      navigate("/");
    }, 7000); // Changed from 2000 to 7000 to account for 5s cart clear delay
  };

  if (orderPlaced) {
    return (
      <div style={{
        position: "fixed", 
        top: 0,
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}>
        <div style={{
          background: "#fff",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", 
          padding: "40px", 
          borderRadius: "16px",
          maxWidth: 400, 
          margin: "0 20px", 
          textAlign: "center",
          animation: "fadeIn 0.3s ease-out"
        }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
          <h2 style={{ color: "#28a745", marginBottom: 16, fontSize: 24 }}>
            Order Confirmed!
          </h2>
          <p style={{ color: "#666", fontSize: 16, marginBottom: 8 }}>
            Your order has been confirmed and saved to Firebase.
          </p>
          <p style={{ color: "#388e3c", fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
            🚚 Delivery in 20 minutes
          </p>
          <p style={{ color: "#ff9800", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            ⏳ Cart will clear in 5 seconds...
          </p>
          <p style={{ color: "#999", fontSize: 13 }}>
            Ensuring order is fully saved to Firebase
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", paddingBottom: 220 }}>
      {/* Admin Button */}
      <AdminButton />
      
      <div style={{
        maxWidth: 480, margin: "40px auto 0 auto", padding: "0 16px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Your Cart (Bottom Sheet)</h2>
          <Link 
            to="/order-history" 
            style={{ 
              textDecoration: "none", 
              background: "#ff9800",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              display: "inline-flex",
              alignItems: "center"
            }}
          >
            📜 My Orders
          </Link>
        </div>
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
