import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQkD7DCQZhOtLxGTPku8kj64o2VErVvPQ",
  authDomain: "homebite-e377a.firebaseapp.com",
  projectId: "homebite-e377a",
  storageBucket: "homebite-e377a.appspot.com",
  messagingSenderId: "1076864651895",
  appId: "1:1076864651895:web:14a84a3b90792d2a986c72",
  measurementId: "G-Q9G3GP151E",
  databaseURL: "https://homebite-e377a-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

// Set up error monitoring
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Firebase Auth is connected. Current user:', user.email);
  } else {
    console.log('Firebase Auth is connected. No user is signed in.');
  }
});

auth.onIdTokenChanged((user) => {
  if (user) {
    user.getIdToken()
      .then(() => console.log('Token refreshed successfully'))
      .catch(error => {
        console.error('Firebase Auth Token Error:', error);
        if (error.code === 'auth/visibility-check-was-unavailable') {
          console.log('Attempting to recover from token error...');
          user.reload().catch(e => console.error('Failed to reload user:', e));
        }
      });
  }
});

export { app, auth, database, db, storage };

// Update the database rules to include the index
const rules = {
  "rules": {
    "users": {
      ".indexOn": ["role"],
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "menu-items": {
      ".indexOn": ["providerId", "category"],
      "$itemId": {
        ".read": true,
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'meal_provider'"
      }
    }
  }
}; 