import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
import AdminButton from "./AdminButton";

export default function OrderHistory() {
  const { orderHistory } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);

  // 🐛 DEBUG: Log order history data
  console.log('📚 Order History Component - orderHistory:', orderHistory);
  if (orderHistory && orderHistory.length > 0) {
    console.log('📊 Total orders:', orderHistory.length);
    orderHistory.forEach((order, idx) => {
      console.log(`   Order ${idx + 1}:`, order);
      console.log(`     - Order Number: ${order.orderNumber}`);
      console.log(`     - Items:`, order.items);
      console.log(`     - Item Count: ${order.itemCount}`);
      if (order.items) {
        console.log(`     - Items Array Length: ${order.items.length}`);
      } else {
        console.log(`     - ⚠️ WARNING: order.items is undefined or null!`);
      }
    });
  } else {
    console.log('❌ No orders in orderHistory');
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const waitingOrders = orderHistory.filter(order => order.status === 'pending');
  const deliveredOrders = orderHistory.filter(order => order.status === 'delivered' || order.status === 'confirmed');
  const cancelledOrders = orderHistory.filter(order => order.status === 'cancelled');

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", padding: "20px" }}>
      {/* Admin Button */}
      <AdminButton />
      
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: 30,
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>📜 My Order History</h1>
          <Link to="/" style={{ 
            textDecoration: "none", 
            background: "#388e3c",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14
          }}>
            ← Back to Home
          </Link>
        </div>

        {orderHistory.length === 0 ? (
          <div style={{ 
            background: "#fff", 
            padding: 60, 
            borderRadius: 12, 
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>📦</div>
            <h2 style={{ color: "#666", marginBottom: 10 }}>No Orders Yet</h2>
            <p style={{ color: "#999", marginBottom: 20 }}>
              You haven't placed any orders yet. Start building your pizza!
            </p>
            <Link to="/" style={{ 
              textDecoration: "none", 
              background: "#388e3c",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 8,
              fontWeight: 600,
              display: "inline-block"
            }}>
              Start Ordering
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ 
              background: "#fff", 
              padding: 15, 
              borderRadius: 8, 
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 24, color: "#388e3c" }}>
                  {orderHistory.length}
                </div>
                <div style={{ fontSize: 14, color: "#666" }}>Total Orders</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 24, color: "#856404" }}>
                  {waitingOrders.length}
                </div>
                <div style={{ fontSize: 14, color: "#666" }}>⏳ Waiting</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 24, color: "#28a745" }}>
                  {deliveredOrders.length}
                </div>
                <div style={{ fontSize: 14, color: "#666" }}>✓ Delivered</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 24, color: "#dc3545" }}>
                  {cancelledOrders.length}
                </div>
                <div style={{ fontSize: 14, color: "#666" }}>❌ Cancelled</div>
              </div>
            </div>
            
            {orderHistory.map((order) => (
              <div key={order.id} style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                border: order.status === 'cancelled' ? "2px solid #f8d7da" : 
                        (order.status === 'confirmed' || order.status === 'delivered') ? "2px solid #d4edda" : "2px solid #fff3cd"
              }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start",
                  marginBottom: 15,
                  paddingBottom: 12,
                  borderBottom: "2px solid #e9ecef"
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, color: "#333", fontSize: 18 }}>
                      Order #{order.id}
                    </h3>
                    <p style={{ margin: "8px 0 4px 0", color: "#666", fontSize: 13 }}>
                      📅 Ordered: {formatTime(order.timestamp)}
                    </p>
                    {(order.status === 'confirmed' || order.status === 'delivered') && (
                      <p style={{ margin: "4px 0", color: "#28a745", fontSize: 13, fontWeight: 600 }}>
                        ✅ Delivered: {formatTime(order.deliveredAt || order.confirmedAt || order.updatedAt)}
                      </p>
                    )}
                    {order.status === 'cancelled' && (
                      <p style={{ margin: "4px 0", color: "#dc3545", fontSize: 13, fontWeight: 600 }}>
                        ❌ Cancelled: {formatTime(order.cancelledAt || order.updatedAt)}
                      </p>
                    )}
                  </div>
                  <div style={{ 
                    background: order.status === 'cancelled' ? "#f8d7da" :
                               (order.status === 'confirmed' || order.status === 'delivered') ? "#d4edda" : "#fff3cd", 
                    color: order.status === 'cancelled' ? "#721c24" :
                           (order.status === 'confirmed' || order.status === 'delivered') ? "#155724" : "#856404", 
                    padding: "6px 12px", 
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap"
                  }}>
                    {order.status === 'cancelled' ? '❌ CANCELLED' :
                     (order.status === 'confirmed' || order.status === 'delivered') ? '✓ DELIVERED' : '⏳ WAITING'}
                  </div>
                </div>

                {order.status === 'cancelled' ? (
                  <div style={{ 
                    background: "#f8d7da", 
                    padding: 12, 
                    borderRadius: 8, 
                    marginBottom: 15,
                    textAlign: "center"
                  }}>
                    <p style={{ margin: 0, color: "#721c24", fontSize: 14, fontWeight: 700 }}>
                      ❌ This order was cancelled by admin
                    </p>
                  </div>
                ) : (order.status === 'confirmed' || order.status === 'delivered') ? (
                  <div style={{ 
                    background: "#d4edda", 
                    padding: 12, 
                    borderRadius: 8, 
                    marginBottom: 15,
                    textAlign: "center"
                  }}>
                    <p style={{ margin: 0, color: "#155724", fontSize: 14, fontWeight: 700 }}>
                      🚚 {order.deliveredBy ? `Delivered by ${order.deliveredBy}` : 'Order Delivered Successfully'}
                    </p>
                  </div>
                ) : (
                  <div style={{ 
                    background: "#fff3cd", 
                    padding: 12, 
                    borderRadius: 8, 
                    marginBottom: 15,
                    textAlign: "center"
                  }}>
                    <p style={{ margin: 0, color: "#856404", fontSize: 14, fontWeight: 700 }}>
                      ⏳ Waiting for admin approval...
                    </p>
                  </div>
                )}
                
                <div style={{ marginBottom: 12 }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#555", fontSize: 15 }}>
                    📦 Items Ordered ({order.itemCount || (order.items && order.items.length) || 0} items):
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                      <li key={idx} style={{
                        background: "#f8f9fa",
                        padding: 10,
                        borderRadius: 6,
                        marginBottom: 8,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderLeft: "3px solid #388e3c"
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                            <span style={{ 
                              background: "#388e3c", 
                              color: "#fff", 
                              padding: "1px 6px", 
                              borderRadius: 3,
                              fontSize: 11,
                              fontWeight: 700
                            }}>
                              #{item.position || idx + 1}
                            </span>
                            <strong style={{ fontSize: 14 }}>{item.name}</strong>
                          </div>
                          <div style={{ fontSize: 12, color: "#666", marginTop: 2, marginLeft: 4 }}>
                            {item.description}
                          </div>
                          {item.orderedBy && (
                            <div style={{ fontSize: 10, color: "#999", marginTop: 3, marginLeft: 4 }}>
                              Added by: <strong>{item.orderedBy}</strong>
                            </div>
                          )}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#388e3c", marginLeft: 10 }}>
                          ₹{item.price}
                        </div>
                      </li>
                    )) : (
                      <li style={{
                        background: "#fff3cd",
                        padding: 20,
                        borderRadius: 6,
                        textAlign: "center",
                        color: "#856404"
                      }}>
                        ⚠️ No items found in this order
                      </li>
                    )}
                  </ul>
                </div>
                
                <div style={{ 
                  borderTop: "2px solid #e9ecef",
                  paddingTop: 12,
                  textAlign: "right"
                }}>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: 20, 
                    color: order.status === 'cancelled' ? "#dc3545" : "#333",
                    textDecoration: order.status === 'cancelled' ? 'line-through' : 'none'
                  }}>
                    💰 Total {order.status === 'cancelled' ? 'Amount (Refunded)' : 
                              (order.status === 'confirmed' || order.status === 'delivered') ? 'Paid' : 'Amount'}: ₹{order.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
