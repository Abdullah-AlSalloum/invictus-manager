// This is a global declaration to tell TypeScript about the firebase object that's loaded from the script tag
declare global {
  interface Window {
    firebase: any;
  }
}

let db: any = null;

// CRITICAL: Replace this with your own Firebase project's configuration from the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyA982xj9tAxNwlFsMYNxg_SPwKSnMmyEm8",
  authDomain: "invictus-manager-db.firebaseapp.com",
  projectId: "invictus-manager-db",
  storageBucket: "invictus-manager-db.firebasestorage.app",
  messagingSenderId: "697070888023",
  appId: "1:697070888023:web:03b6c9351d747d19806f12"
};


// This function safely initializes Firebase and returns the Firestore instance.
// It waits until the Firebase SDK scripts are loaded before trying to connect.
export const getDb = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const checkFirebase = () => {
      if (window.firebase && window.firebase.firestore) {
        try {
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(firebaseConfig);
          }
          db = window.firebase.firestore();
          resolve(db);
        } catch (error) {
          console.error("Firebase initialization failed:", error);
          reject(error);
        }
      } else {
        // If Firebase is not ready, check again shortly.
        setTimeout(checkFirebase, 100);
      }
    };
    checkFirebase();
  });
};
