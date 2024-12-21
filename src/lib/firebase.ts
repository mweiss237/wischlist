import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD4W2BijDWSvRq5LGdER284H5Er4k4Xzxc",
  authDomain: "wischlist-cd9c6.firebaseapp.com",
  projectId: "wischlist-cd9c6",
  storageBucket: "wischlist-cd9c6.appspot.com",
  messagingSenderId: "777134630529",
  appId: "1:777134630529:web:7909aff7f1a870addf4f80"
};
const DB_URL = "https://wischlist-cd9c6-default-rtdb.europe-west1.firebasedatabase.app"

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const storage = getStorage(app)

export const database = getDatabase(app, DB_URL)
