import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "***REMOVED***",
    authDomain: "tarif-487200.firebaseapp.com",
    projectId: "tarif-487200",
    storageBucket: "tarif-487200.firebasestorage.app",
    messagingSenderId: "457051767073",
    appId: "1:457051767073:web:ce1c2f546da69db6c17e60"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
