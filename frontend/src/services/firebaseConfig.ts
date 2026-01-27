// File: services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Firebase Config từ login-cb5c5 project
// Get this from Firebase Console: Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyCgJrd1kv9oBsARWB1sv_w2lGFFUm_qkI0",
  authDomain: "login-cb5c5.firebaseapp.com",
  databaseURL: "https://login-cb5c5-default-rtdb.firebaseio.com",
  projectId: "login-cb5c5",
  storageBucket: "login-cb5c5.firebasestorage.app",
  messagingSenderId: "545674664487",
  appId: "1:545674664487:web:c3779fa60e97a150d10c02",
  measurementId: "G-N8Y64QB92F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore (for document-based storage)
export const db = getFirestore(app);

// Realtime Database (for real-time chat messages)
export const realtimeDb = getDatabase(app);

// Auth
export const auth = getAuth(app);

export default app;
