import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcq4iENcFhaFmUkVrsUMhCUcmmYRhPqnI",
    authDomain: "ecommerce-web-9521a.firebaseapp.com",
    projectId: "ecommerce-web-9521a",
    storageBucket: "ecommerce-web-9521a.firebasestorage.app",
    messagingSenderId: "503033266909",
    appId: "1:503033266909:web:3feccecbccea1498a55134",
    measurementId: "G-0PHDYRZKGG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Initialize Google Provider with forced account selection
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
    prompt: 'select_account'  // Forces account selection
});

// Clear any existing auth persistence
auth.setPersistence(browserLocalPersistence);

export const db = getFirestore(app);
