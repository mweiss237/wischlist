// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "wischlist-cd9c6.firebaseapp.com",
  projectId: "wischlist-cd9c6",
  storageBucket: "wischlist-cd9c6.appspot.com",
  messagingSenderId: "777134630529",
  appId: "1:777134630529:web:7909aff7f1a870addf4f80",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

try {
  // Initialize Firebase
  console.log("Firebase initialized.");
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export default app;
