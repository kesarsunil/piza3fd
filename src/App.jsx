import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import "./index.css";

// Lazy load heavy components
const PizzaBuilder = lazy(() => import("./PizzaBuilder"));
const Cart = lazy(() => import("./Cart"));
const CartPage2 = lazy(() => import("./CartPage2"));
const AdminPage = lazy(() => import("./AdminPage"));
const OrderHistory = lazy(() => import("./OrderHistory"));

// Loading component
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid rgba(255,255,255,0.3)',
        borderTop: '5px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      Loading...
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute requireCustomer={true}>
                    <PizzaBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute requireCustomer={true}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart2"
                element={
                  <ProtectedRoute requireCustomer={true}>
                    <CartPage2 />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<AdminPage />} />
              <Route
                path="/order-history"
                element={
                  <ProtectedRoute requireCustomer={true}>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
