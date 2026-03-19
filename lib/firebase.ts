import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCV88E_q7MYwnpQE73TgY7DVLg8XNTPw9U",
  authDomain: "flutter-auth-44f1b.firebaseapp.com",
  projectId: "flutter-auth-44f1b",
  storageBucket: "flutter-auth-44f1b.firebasestorage.app",
  messagingSenderId: "694673734852",
  appId: "1:694673734852:web:69a50f30dbb1fc708edd91",
  measurementId: "G-HJTFM8PP3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;