// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3P_NNczvc2xwS3w1E-3AKixs-q4ZLgnE",
  authDomain: "pizza3-b5abb.firebaseapp.com",
  projectId: "pizza3-b5abb",
  storageBucket: "pizza3-b5abb.firebasestorage.app",
  messagingSenderId: "497652482955",
  appId: "1:497652482955:web:48fef9707153615a70258e",
  measurementId: "G-LWZK9ZVKPH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export services for use in other files
export { app, analytics, db, auth };
