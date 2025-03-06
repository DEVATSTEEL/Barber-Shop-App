// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVSHt6m4zN-gfmPGAoAozgq8a8da_mpS4",
  authDomain: "mobile-app-daa56.firebaseapp.com",
  projectId: "mobile-app-daa56",
  storageBucket: "mobile-app-daa56.firebasestorage.app",
  messagingSenderId: "117297943088",
  appId: "1:117297943088:web:ab5865e4974ece385013f5",
  measurementId: "G-TKSQ187ZZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase auth instance
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Make sure Firestore is initialized

export { auth, db };