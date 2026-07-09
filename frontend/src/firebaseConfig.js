// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt5mi0qLQeBBwDjsHaqzgvJwz2MYl8VRE",
  authDomain: "taskmanager-c1485.firebaseapp.com",
  projectId: "taskmanager-c1485",
  storageBucket: "taskmanager-c1485.firebasestorage.app",
  messagingSenderId: "1000917916082",
  appId: "1:1000917916082:web:e5f0bf18be8209a9c0ecab",
  measurementId: "G-BYPYTZDF2X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
