// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export default app;