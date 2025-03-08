import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, setPersistence, browserLocalPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVSHt6m4zN-gfmPGAoAozgq8a8da_mpS4",
  authDomain: "mobile-app-daa56.firebaseapp.com",
  projectId: "mobile-app-daa56",
  storageBucket: "mobile-app-daa56.appspot.com",
  messagingSenderId: "117297943088",
  appId: "1:117297943088:web:ab5865e4974ece385013f5",
  measurementId: "G-TKSQ187ZZ5",
};

// ✅ Ensure Firebase is only initialized once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Set auth persistence (keeps user logged in)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase Auth Persistence Error:", error);
});

// ✅ Export Firebase services
export { auth, db };
export default app;
