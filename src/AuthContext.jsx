import React, { createContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for persisted admin session on mount
  useEffect(() => {
    console.log('========================================');
    console.log('🔍 AUTHCONTEXT: Checking for persisted admin session...');
    const persistedAdmin = localStorage.getItem('adminSession');
    console.log('📦 localStorage adminSession:', persistedAdmin);
    
    if (persistedAdmin === 'true') {
      console.log('✅ Restored admin session from localStorage');
      setCurrentUser('admin');
      setUsername('admin');
      setFirebaseUid('admin-direct-access');
      setUserRole('admin');
      setIsLoggedIn(true);
      setLoading(false); // Admin session restored, stop loading
      console.log('✅ All admin states set - userRole is now: admin');
    } else {
      console.log('⚠️ No admin session found in localStorage');
    }
    console.log('========================================');
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Firebase Auth state changed:', user ? 'User logged in' : 'No user');
      
      if (user) {
        // User is signed in via Firebase Auth
        const displayName = user.displayName || user.email?.split('@')[0] || 'User';
        
        setCurrentUser(displayName);
        setUsername(displayName);
        setFirebaseUid(user.uid);
        setIsLoggedIn(true);
        
        // Check if admin (you can customize this logic)
        if (displayName === 'admin' || user.uid === 'admin-direct-access') {
          setUserRole('admin');
        } else {
          setUserRole('customer');
        }
        
        console.log('✅ Firebase Auth: User logged in', {
          displayName,
          uid: user.uid,
          email: user.email,
          role: displayName === 'admin' ? 'admin' : 'customer'
        });
      } else {
        // Only clear state if there's no admin bypass session
        // Check if we have an admin bypass (manual login)
        const persistedAdmin = localStorage.getItem('adminSession');
        if (persistedAdmin !== 'true') {
          setCurrentUser(null);
          setUsername(null);
          setFirebaseUid(null);
          setUserRole(null);
          setIsLoggedIn(false);
          
          console.log('🚪 Firebase Auth: User logged out');
        }
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Login function (for admin direct access)
  const loginAsAdmin = () => {
    setCurrentUser('admin');
    setUsername('admin');
    setFirebaseUid('admin-direct-access');
    setUserRole('admin');
    setIsLoggedIn(true);
    localStorage.setItem('adminSession', 'true');
    console.log('🔓 Admin logged in directly (persisted to localStorage)');
  };

  // Logout function
  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUsername(null);
      setFirebaseUid(null);
      setUserRole(null);
      setIsLoggedIn(false);
      localStorage.removeItem('adminSession');
      console.log('👋 User logged out (cleared localStorage)');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const value = {
    currentUser,
    username,
    firebaseUid,
    userRole,
    isLoggedIn,
    loading,
    loginAsAdmin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
