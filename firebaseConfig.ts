// This file relies on the Firebase SDKs being loaded globally via script tags in index.html
import { initializeApp } from "firebase/app";
// Extend the Window interface to include the firebase object for TypeScript
declare global {
  interface Window {
    firebase: any;
  }
}
const firebaseConfig = {
  apiKey: "AIzaSyA982xj9tAxNwlFsMYNxg_SPwKSnMmyEm8",
  authDomain: "invictus-manager-db.firebaseapp.com",
  projectId: "invictus-manager-db",
  storageBucket: "invictus-manager-db.firebasestorage.app",
  messagingSenderId: "697070888023",
  appId: "1:697070888023:web:03b6c9351d747d19806f12"
};



// Initialize Firebase using the globally available `firebase` object
if (!window.firebase.apps.length) {
  window.firebase.initializeApp(firebaseConfig);
}

const db = window.firebase.firestore();

export { db };
