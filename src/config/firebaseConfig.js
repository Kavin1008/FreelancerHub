import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration details
const firebaseConfig = {
    apiKey: "AIzaSyDIQXKtYaUhfxzwbpUuWCzfZHXhDy0iOd4",
    authDomain: "freelancerdirectory-d6ad4.firebaseapp.com",
    projectId: "freelancerdirectory-d6ad4",
    storageBucket: "freelancerdirectory-d6ad4.appspot.com",
    messagingSenderId: "82994075709",
    appId: "1:82994075709:web:b57a6b315213a37958b254",
    measurementId: "G-XGZ8RGJ3FJ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth instances
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };


