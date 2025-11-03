import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import PizzaBuilder from "./PizzaBuilder";
import Cart from "./Cart";
import CartPage2 from "./CartPage2";
import AdminPage from "./AdminPage";
import OrderHistory from "./OrderHistory";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
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
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
