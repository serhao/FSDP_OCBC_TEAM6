// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnSkq5q973ExazRK2KD7Mst6M1wnCc9zE",
  authDomain: "bedassg.firebaseapp.com",
  projectId: "bedassg",
  storageBucket: "bedassg.firebasestorage.app",
  messagingSenderId: "915606246223",
  appId: "1:915606246223:web:080dc2a1b6707804856b3a",
  measurementId: "G-62QD0MZV9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
