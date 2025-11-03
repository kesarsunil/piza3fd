import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import AdminButton from "./AdminButton";

export default function Cart() {
  const { cartItems, placeOrder, removeFromCart, confirmOrder } = useContext(CartContext);
  const { currentUser, firebaseUid } = useContext(AuthContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Add pulse animation CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0%, 100% { box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4); }
        50% { box-shadow: 0 4px 25px rgba(40, 167, 69, 0.8); }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const handlePlaceOrder = async () => {
    console.log('========================================');
    console.log('🛒 PLACE ORDER CLICKED IN Cart.jsx!');
    console.log('========================================');
    console.log('📦 cartItems:', cartItems);
    console.log('📦 cartItems.length:', cartItems.length);
    console.log('📦 cartItems type:', typeof cartItems);
    console.log('📦 cartItems is array?:', Array.isArray(cartItems));
    console.log('👤 Current User:', currentUser);
    console.log('👤 Firebase UID:', firebaseUid);
    
    // Set processing state
    setIsProcessing(true);
    
    // 🔥 LOG EACH CART ITEM DETAILS
    console.log('========================================');
    console.log('🍕 DETAILED CART ITEMS:');
    console.log('========================================');
    if (cartItems && cartItems.length > 0) {
      cartItems.forEach((item, idx) => {
        console.log(`Item ${idx + 1}:`);
        console.log('  Name:', item.name);
        console.log('  Price:', item.price);
        console.log('  Description:', item.description);
        console.log('  Full item:', item);
      });
      console.log('========================================');
      console.log('✅ Total items that will be in ONE order:', cartItems.length);
      console.log('✅ Total price:', cartItems.reduce((sum, item) => sum + (item.price || 0), 0));
      console.log('========================================');
    }
    
    // ✅ VALIDATION: Ensure cart has at least 1 item
    if (!cartItems || cartItems.length === 0) {
      console.error('❌ VALIDATION FAILED: Cart is empty!');
      console.error('❌ cartItems:', cartItems);
      alert(
        '❌ Cannot Place Order!\n\n' +
        '📦 Your cart is empty.\n\n' +
        '⚠️ Minimum Requirement: 1 or more items\n\n' +
        '➡️ Please add at least one pizza to your cart before placing an order.\n\n' +
        '💡 Go to Pizza Builder to add items.'
      );
      return;
    }
    
    // Log cart items for debugging
    console.log('✅ VALIDATION PASSED: Cart has items');
    console.log('📝 Cart items details:');
    cartItems.forEach((item, idx) => {
      console.log(`  ${idx + 1}. Name: ${item.name}, Price: ${item.price}, Description: ${item.description}`);
    });
    console.log('========================================');
    
    // Build items list for console logging
    const itemsList = cartItems.map((item, idx) => 
      `${idx + 1}. ${item.name} - ₹${item.price}\n   ${item.description || 'No toppings'}`
    ).join('\n\n');
    
    console.log('✅ User placing order with all cart items!');
    console.log('📦 Items:', itemsList);
    
    try {
      console.log('🔥 Calling placeOrder function from CartContext...');
      console.log('🔍 placeOrder function exists?', !!placeOrder);
      console.log('🔍 placeOrder type:', typeof placeOrder);
      
      if (!placeOrder) {
        alert('❌ ERROR: placeOrder function not found in CartContext!');
        console.error('❌ placeOrder is undefined!');
        return;
      }
      
      console.log('🚀 Calling placeOrder NOW...');
      const orderId = await placeOrder({
        customerName: "Customer",
        customerPhone: "1234567890"
      });
      
      console.log('✅ placeOrder completed! Returned Order ID:', orderId);
      console.log('🔗 Check Firebase Console now at:');
      console.log('https://console.firebase.google.com/project/pizza3-b5abb/firestore');
      
      if (orderId) {
        console.log('========================================');
        console.log('✅ ORDERS SUCCESSFULLY PLACED!');
        console.log('========================================');
        
        // Success alert shown by CartContext - just redirect
        setOrderPlaced(true);
        
        // Fast redirect to Order History after viewing alert
        setTimeout(() => {
          setOrderPlaced(false);
          setIsProcessing(false);
          console.log('📜 Redirecting to Order History page...');
          navigate("/order-history");
        }, 800);
      } else {
        console.error('❌ placeOrder returned null or undefined!');
        setIsProcessing(false);
        alert('❌ Order failed! Check console for details.');
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('❌ ERROR in handlePlaceOrder:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);
      console.error('❌ Full error:', JSON.stringify(error, null, 2));
      alert('❌ FAILED TO SAVE ORDER!\n\nError: ' + error.message + '\n\nCheck console (F12) for details.');
    }
  };

  const handleRemoveItem = (index) => {
    removeFromCart(index);
  };

  if (orderPlaced) {
    return (
      <div
        style={{
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
        }}
      >
        <div
          style={{
            maxWidth: 420,
            margin: "0 20px",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            padding: "40px 32px",
            textAlign: "center",
            animation: "fadeIn 0.3s ease-out"
          }}
        >
          <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
          <h2 style={{ color: "#28a745", marginBottom: 16, fontSize: 24 }}>
            Order Confirmed!
          </h2>
          <p style={{ color: "#666", fontSize: 16, marginBottom: 8 }}>
            Your order has been saved to Firebase successfully.
          </p>
          <p style={{ color: "#388e3c", fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
            🚚 Delivery in 20 minutes
          </p>
          <p style={{ color: "#2196f3", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            📜 Redirecting to Order History...
          </p>
          <p style={{ color: "#999", fontSize: 13 }}>
            View your order details in Order History
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 650,
        margin: "60px auto",
        background: "linear-gradient(135deg, #f8fafc 0%, #e9f5ff 100%)",
        borderRadius: 18,
        boxShadow: "0 4px 24px #e0e7ef",
        padding: "40px 32px 32px 32px",
        minHeight: 340,
      }}
    >
      {/* Admin Button */}
      <AdminButton />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1
          style={{
            color: "#222",
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Your Cart
        </h1>
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
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          📜 My Orders
        </Link>
      </div>
      {cartItems.length === 0 ? (
        <p
          style={{
            color: "#888",
            textAlign: "center",
            marginBottom: 32,
            marginTop: 28,
          }}
        >
          No items in cart.
        </p>
      ) : (
        <>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginBottom: 20,
              marginTop: 28,
            }}
          >
            {cartItems.map((item, idx) => {
              console.log('🔍 Rendering cart item:', idx, item);
              return (
              <li
                key={idx}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: "16px 20px",
                  marginBottom: 16,
                  boxShadow: "0 2px 8px #ddd",
                  border: "2px solid #eee",
                  overflow: "visible"
                }}
              >
                {/* Item Name & Description */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, color: "#222", fontSize: 17, marginBottom: 6 }}>
                    {item.name}
                  </div>
                  <div style={{ color: "#888", fontSize: 14 }}>
                    {item.description}
                  </div>
                </div>
                
                {/* Price & Remove Button Row */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  paddingTop: 8,
                  borderTop: "1px solid #eee"
                }}>
                  <div style={{ 
                    fontWeight: 700, 
                    color: "#388e3c", 
                    fontSize: 20
                  }}>
                    Price: ₹{item.price}
                  </div>
                  
                  <button
                    onClick={() => {
                      console.log('🗑️ Remove button clicked for item:', idx, item.name);
                      handleRemoveItem(idx);
                    }}
                    style={{
                      background: "#ff4444",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      padding: "12px 24px",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 15,
                      boxShadow: "0 3px 10px rgba(255, 68, 68, 0.5)",
                      transition: "all 0.3s"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#cc0000";
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#ff4444";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    🗑️ REMOVE
                  </button>
                </div>
              </li>
              );
            })}
          </ul>
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "16px 18px",
              marginBottom: 20,
              boxShadow: "0 2px 8px #e0e7ef",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 20, color: "#222" }}>Total:</span>
            <span style={{ fontWeight: 700, fontSize: 24, color: "#388e3c" }}>₹{total}</span>
          </div>
        </>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={cartItems.length === 0 || isProcessing}
        style={{
          width: "100%",
          background: cartItems.length === 0 || isProcessing ? "#ccc" : "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "18px 0",
          fontWeight: 700,
          fontSize: 20,
          cursor: cartItems.length === 0 || isProcessing ? "not-allowed" : "pointer",
          boxShadow: cartItems.length === 0 || isProcessing ? "none" : "0 4px 15px rgba(40, 167, 69, 0.4)",
          marginBottom: 18,
          transition: "transform 0.2s",
          animation: cartItems.length > 0 && !isProcessing ? "pulse 2s infinite" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}
        onMouseOver={(e) => {
          if (cartItems.length > 0 && !isProcessing) e.target.style.transform = "translateY(-2px)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
        }}
      >
        {isProcessing ? (
          <>
            <span style={{
              display: "inline-block",
              width: "20px",
              height: "20px",
              border: "3px solid rgba(255,255,255,0.3)",
              borderTop: "3px solid white",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }}></span>
            Processing Order...
          </>
        ) : (
          cartItems.length === 0 ? "Cart is Empty" : "✅ Confirm Order"
        )}
      </button>
      
      {/* Validation Message - Show minimum requirement */}
      {cartItems.length === 0 ? (
        <div style={{
          background: "#ffebee",
          border: "2px solid #f44336",
          borderRadius: 8,
          padding: "14px 16px",
          marginBottom: 18,
          textAlign: "center",
          fontSize: 14,
          color: "#c62828"
        }}>
          <div style={{ fontSize: 16, marginBottom: 6 }}>
            <strong>❌ Cannot Place Order</strong>
          </div>
          <div style={{ marginBottom: 4 }}>
            📦 <strong>Minimum Requirement:</strong> Cart must have 1 or more items
          </div>
          <div style={{ fontSize: 12, color: "#d32f2f" }}>
            ➡️ Add at least one pizza to enable order placement
          </div>
        </div>
      ) : (
        <div style={{
          background: "#e8f5e9",
          border: "2px solid #4caf50",
          borderRadius: 8,
          padding: "14px 16px",
          marginBottom: 18,
          textAlign: "center",
          fontSize: 14,
          color: "#2e7d32"
        }}>
          <div style={{ fontSize: 16, marginBottom: 6 }}>
            <strong>✅ Ready to Order!</strong>
          </div>
          <div style={{ marginBottom: 4 }}>
            📦 <strong>Total Items:</strong> {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </div>
          <div style={{ marginBottom: 4 }}>
            💰 <strong>Total Amount:</strong> ₹{total}
          </div>
          <div style={{ fontSize: 12, color: "#388e3c" }}>
            🔥 Click "PLACE ORDER" to save to Firebase
          </div>
        </div>
      )}
      
      {cartItems.length > 0 && (
        <div style={{
          background: "#fff3cd",
          border: "2px solid #ffc107",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 18,
          textAlign: "center",
          fontSize: 14,
          color: "#856404"
        }}>
          <strong>⚠️ IMPORTANT:</strong> Click "PLACE ORDER" button above to save your order to Firebase!
        </div>
      )}
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