// Import the functions you need from the SDKs you need
// import { firestore } from "firebase-admin";
// import { initializeApp } from "firebase-admin/app";
import certConfig from "./../wischlist-cd9c6-firebase-adminsdk-v6w8f-b72f9c4e78.json"

import admin from "firebase-admin"
import { cert } from "firebase-admin/app"

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: "wischlist-cd9c6.firebaseapp.com",
//   projectId: "wischlist-cd9c6",
//   storageBucket: "wischlist-cd9c6.appspot.com",
//   messagingSenderId: "777134630529",
//   appId: "1:777134630529:web:7909aff7f1a870addf4f80",
// };

try {
  // Initialize Firebase
  admin.initializeApp({
    // @ts-ignore
    credential: cert(certConfig),
  })
  console.log("Firebase initialized.")
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack)
  }
}

export default admin
