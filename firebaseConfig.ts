// This file relies on the Firebase SDKs being loaded globally via script tags in index.html

// Extend the Window interface to include the firebase object for TypeScript
declare global {
  interface Window {
    firebase: any;
  }
}

// This is your unique configuration object, which you have already set up.
const firebaseConfig = {
  apiKey: "AIzaSyA982xj9tAxNwlFsMYNxg_SPwKSnMmyEm8",
  authDomain: "invictus-manager-db.firebaseapp.com",
  projectId: "invictus-manager-db",
  storageBucket: "invictus-manager-db.firebasestorage.app",
  messagingSenderId: "697070888023",
  appId: "1:697070888023:web:03b6c9351d747d19806f12"
};

let dbInstance: any = null;

/**
 * Waits for the global Firebase object to be available, then initializes
 * Firebase and returns the Firestore database instance. This prevents race
 * condition errors where the app tries to use Firebase before it's loaded.
 */
export const getDb = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // If the instance already exists, resolve with it immediately.
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const timeout = setTimeout(() => {
        clearInterval(interval);
        reject(new Error("Firebase SDK failed to load in a reasonable time. Please check your network connection and the script tags in index.html."));
    }, 10000); // 10 second timeout

    const interval = setInterval(() => {
      // Once the global `firebase` object is available...
      if (window.firebase && window.firebase.firestore) {
        clearInterval(interval); // Stop checking
        clearTimeout(timeout);
        try {
          // Initialize the app if it hasn't been already
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(firebaseConfig);
          }
          // Get the Firestore instance and cache it
          dbInstance = window.firebase.firestore();
          resolve(dbInstance);
        } catch (error) {
          console.error("Firebase initialization failed:", error);
          reject(error);
        }
      }
    }, 50); // Check every 50ms
  });
};