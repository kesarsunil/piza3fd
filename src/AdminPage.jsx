import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collectionGroup, onSnapshot } from 'firebase/firestore';

export default function AdminPage() {
  const { updateOrderStatus } = useContext(CartContext);
  const { username, logout, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders directly in AdminPage
  useEffect(() => {
    console.log('========================================');
    console.log('🔥 ADMIN PAGE: Setting up orders listener');
    console.log('========================================');
    
    setLoading(true);
    
    // Fetch all orders from all customers
    // NOTE: Using collectionGroup WITHOUT orderBy to avoid index requirement
    const unsubscribe = onSnapshot(
      collectionGroup(db, 'orders'),
      (snapshot) => {
        console.log('========================================');
        console.log('📊 ADMIN PAGE: Orders snapshot received!');
        console.log('📦 Total orders from Firebase:', snapshot.size);
        
        const ordersData = [];
        snapshot.forEach((doc) => {
          const orderData = { 
            id: doc.id, 
            firestoreId: doc.id, 
            documentPath: doc.ref.path,
            ...doc.data() 
          };
          console.log('📋 Order:', orderData.orderNumber, '- Customer:', orderData.customer);
          ordersData.push(orderData);
        });
        
        // Sort orders by timestamp in JavaScript (newest first)
        ordersData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        console.log('========================================');
        console.log('✅ ADMIN PAGE: Setting orders state with', ordersData.length, 'orders');
        console.log('📊 Orders array:', ordersData);
        console.log('========================================');
        
        setOrders(ordersData);
        setLoading(false);
        
        console.log('✅ State updated! loading=false, orders.length=', ordersData.length);
      },
      (error) => {
        console.error('========================================');
        console.error('❌ ERROR loading orders:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        console.error('========================================');
        setOrders([]); // Set empty array on error
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Debug: Log whenever orders or loading changes
  useEffect(() => {
    console.log('🔍 RENDER STATE CHANGED:');
    console.log('   📦 orders.length:', orders.length);
    console.log('   ⏳ loading:', loading);
    console.log('   📋 orders array:', orders);
  }, [orders, loading]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleDelivered = async (order) => {
    if (!order.documentPath) {
      alert('❌ Cannot update: Missing document path');
      return;
    }
    
    const confirmUpdate = window.confirm(
      `✅ Mark this order as DELIVERED?\n\n` +
      `Order: ${order.orderNumber}\n` +
      `Customer: ${order.customer}\n` +
      `Total: ₹${order.total}\n\n` +
      `This will update immediately.`
    );
    
    if (confirmUpdate) {
      try {
        setUpdatingOrderId(order.id);
        await updateOrderStatus(order.documentPath, 'delivered');
        // UI will update automatically via Firebase listener
        setTimeout(() => setUpdatingOrderId(null), 500);
      } catch (error) {
        setUpdatingOrderId(null);
        console.error('Error updating order:', error);
        alert('❌ Failed to update order. Please try again.');
      }
    }
  };

  const handleCancelled = async (order) => {
    if (!order.documentPath) {
      alert('❌ Cannot update: Missing document path');
      return;
    }
    
    const confirmUpdate = window.confirm(
      `❌ Mark this order as CANCELLED?\n\n` +
      `Order: ${order.orderNumber}\n` +
      `Customer: ${order.customer}\n` +
      `Total: ₹${order.total}\n\n` +
      `This will update immediately.`
    );
    
    if (confirmUpdate) {
      try {
        setUpdatingOrderId(order.id);
        await updateOrderStatus(order.documentPath, 'cancelled');
        // UI will update automatically via Firebase listener
        setTimeout(() => setUpdatingOrderId(null), 500);
      } catch (error) {
        setUpdatingOrderId(null);
        console.error('Error updating order:', error);
        alert('❌ Failed to update order. Please try again.');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 30,
          background: '#fff',
          padding: 20,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#333' }}> Admin Dashboard</h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>Welcome, {username}</p>
          </div>
          <button onClick={handleLogout} style={{
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 16
          }}>
            Logout
          </button>
        </div>

        <div>
          <h2 style={{ marginBottom: 20 }}>All Customer Orders</h2>
          {loading ? (
            <div style={{ background: '#fff', padding: 40, borderRadius: 12, textAlign: 'center' }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ background: '#fff', padding: 40, borderRadius: 12, textAlign: 'center' }}>
              No orders yet
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} style={{
                background: '#fff',
                borderRadius: 12,
                padding: 24,
                marginBottom: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: 15,
                  paddingBottom: 15,
                  borderBottom: '2px solid #f0f0f0'
                }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#333' }}>Order #{order.orderNumber || order.id}</h3>
                    <p style={{ margin: '8px 0 4px 0', color: '#666', fontSize: 14 }}>
                       {formatTime(order.timestamp)}
                    </p>
                    <p style={{ margin: '4px 0', color: '#666', fontSize: 14 }}>
                       Customer: <strong>{order.customer}</strong>
                    </p>
                    <p style={{ margin: '4px 0', color: '#666', fontSize: 14 }}>
                       Phone: {order.customerPhone} |  Items: {order.items?.length || 0}
                    </p>
                    {order.documentPath && (
                      <p style={{ margin: '4px 0', color: '#999', fontSize: 12 }}>
                         {order.documentPath}
                      </p>
                    )}
                  </div>
                  <div style={{ 
                    background: order.status === 'pending' ? '#fff3cd' : 
                               order.status === 'delivered' ? '#d4edda' : '#f8d7da',
                    color: order.status === 'pending' ? '#856404' : 
                           order.status === 'delivered' ? '#155724' : '#721c24',
                    padding: '8px 16px', 
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 700,
                    height: 'fit-content'
                  }}>
                    {order.status?.toUpperCase() || 'PENDING'}
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: '#555' }}>Order Items:</h4>
                  {order.items && order.items.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {order.items.map((item, idx) => (
                        <li key={idx} style={{
                          background: '#f8f9fa',
                          padding: 12,
                          borderRadius: 8,
                          marginBottom: 10,
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            <strong>{item.name}</strong>
                            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                              {item.description}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 16, color: '#28a745' }}>
                            ₹{item.price}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#999' }}>No items</p>
                  )}
                </div>
                <div style={{ 
                  marginTop: 15,
                  paddingTop: 15,
                  borderTop: '2px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontWeight: 700, fontSize: 22, color: '#333' }}>
                    Total: ₹{order.total}
                  </div>
                  
                  {/* Action Buttons - Only show if order is pending */}
                  {order.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => handleDelivered(order)}
                        disabled={updatingOrderId === order.id}
                        style={{
                          background: updatingOrderId === order.id ? '#6c757d' : '#28a745',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 20px',
                          fontWeight: 600,
                          cursor: updatingOrderId === order.id ? 'not-allowed' : 'pointer',
                          fontSize: 14,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          transition: 'all 0.3s',
                          opacity: updatingOrderId === order.id ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (updatingOrderId !== order.id) {
                            e.target.style.background = '#218838';
                            e.target.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (updatingOrderId !== order.id) {
                            e.target.style.background = '#28a745';
                            e.target.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {updatingOrderId === order.id ? '⏳ Updating...' : '✅ Mark Delivered'}
                      </button>
                      
                      <button
                        onClick={() => handleCancelled(order)}
                        disabled={updatingOrderId === order.id}
                        style={{
                          background: updatingOrderId === order.id ? '#6c757d' : '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 20px',
                          fontWeight: 600,
                          cursor: updatingOrderId === order.id ? 'not-allowed' : 'pointer',
                          fontSize: 14,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          transition: 'all 0.3s',
                          opacity: updatingOrderId === order.id ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (updatingOrderId !== order.id) {
                            e.target.style.background = '#c82333';
                            e.target.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (updatingOrderId !== order.id) {
                            e.target.style.background = '#dc3545';
                            e.target.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {updatingOrderId === order.id ? '⏳ Updating...' : '❌ Cancel Order'}
                      </button>
                    </div>
                  ) : (
                    /* Show status message for completed/cancelled orders */
                    <div style={{ 
                      padding: '12px 20px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      background: order.status === 'delivered' ? '#d4edda' : '#f8d7da',
                      color: order.status === 'delivered' ? '#155724' : '#721c24',
                      border: order.status === 'delivered' ? '2px solid #28a745' : '2px solid #dc3545'
                    }}>
                      {order.status === 'delivered' ? '✅ Order Delivered - Cannot be changed' : '❌ Order Cancelled - Cannot be changed'}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
