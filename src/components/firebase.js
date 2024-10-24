// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
 import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app);
export default app;
