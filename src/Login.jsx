import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Customer login/signup with Firebase
      let userCredential;
      
      if (isSignUp) {
        // Sign up new customer
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Set display name
        const username = displayName || email.split('@')[0];
        await updateProfile(user, { displayName: username });
        
        console.log("✅ New customer account created:", email);
        console.log("👤 Display name set to:", username);
      } else {
        // Sign in existing customer
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Customer logged in:", email);
      }
      
      // AuthContext will automatically handle user state via onAuthStateChanged
      navigate("/");
    } catch (error) {
      console.error("❌ Login error:", error);
      
      // User-friendly error messages
      switch (error.code) {
        case 'auth/user-not-found':
          setError("No account found with this email. Try signing up!");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/email-already-in-use':
          setError("Email already registered. Try logging in instead.");
          break;
        case 'auth/weak-password':
          setError("Password should be at least 6 characters.");
          break;
        case 'auth/invalid-email':
          setError("Invalid email address.");
          break;
        default:
          setError(error.message || "Login failed. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "50px 40px",
          maxWidth: 400,
          width: "100%",
        }}
      >
        {/* Logo/Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 60, marginBottom: 10 }}>🍕</div>
          <h1 style={{ margin: 0, fontSize: 32, color: "#333", marginBottom: 10 }}>
            Pizza Builder
          </h1>
          <p style={{ margin: 0, color: "#666", fontSize: 16 }}>
            {isSignUp ? "Create your account" : "Welcome back! Please login to continue."}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Display Name Field (Sign Up Only) */}
          {isSignUp && (
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#333",
                  fontSize: 14,
                }}
              >
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "2px solid #e0e0e0",
                  fontSize: 16,
                  outline: "none",
                  transition: "border-color 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                color: "#333",
                fontSize: 14,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                border: "2px solid #e0e0e0",
                fontSize: 16,
                outline: "none",
                transition: "border-color 0.3s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 30 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
                color: "#333",
                fontSize: 14,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                border: "2px solid #e0e0e0",
                fontSize: 16,
                outline: "none",
                transition: "border-color 0.3s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "#fee",
                color: "#c33",
                padding: "12px 16px",
                borderRadius: 8,
                marginBottom: 20,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* Login/Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              background: isLoading
                ? "#ccc"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 18,
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "transform 0.2s",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
            }}
          >
            {isLoading ? (isSignUp ? "Creating Account..." : "Logging in...") : (isSignUp ? "Sign Up" : "Login")}
          </button>
        </form>

        {/* Toggle Sign Up/Login */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              fontSize: 14,
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Demo Credentials */}
        <div
          style={{
            marginTop: 30,
            padding: 20,
            background: "#f8f9fa",
            borderRadius: 10,
            fontSize: 13,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 10, color: "#333" }}>
            🔑 Customer Login:
          </div>
          <div style={{ color: "#666", marginBottom: 6 }}>
            👤 Sign up with any email & password (min 6 characters)
          </div>
          <div style={{ color: "#999", fontSize: 12, marginTop: 12 }}>
            🔥 Customer accounts stored securely in Firebase Authentication
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "#999",
            fontSize: 12,
          }}
        >
          🔥 Powered by Firebase Authentication
        </div>
      </div>
    </div>
  );
}
