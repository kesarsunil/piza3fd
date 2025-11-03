import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false, requireCustomer = false }) {
  const { isLoggedIn, userRole, loading } = useContext(AuthContext);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '24px'
      }}>
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && userRole !== "admin") {
    // Trying to access admin route without admin role
    return <Navigate to="/" replace />;
  }

  if (requireCustomer && userRole === "admin") {
    // Admin trying to access customer-only pages
    return <Navigate to="/admin" replace />;
  }

  return children;
}
