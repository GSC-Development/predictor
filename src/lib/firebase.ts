// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqvkRLumacHCFMrsWWqhE4-sqMmCtRvA0",
  authDomain: "predictor-8ee14.firebaseapp.com",
  projectId: "predictor-8ee14",
  storageBucket: "predictor-8ee14.firebasestorage.app",
  messagingSenderId: "589644407109",
  appId: "1:589644407109:web:4d6a56b6ffe5f638dd5e2c",
  measurementId: "G-3MGTM0656Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app; 