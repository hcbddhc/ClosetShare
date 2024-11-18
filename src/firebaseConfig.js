// src/firebaseConfig.js

// Import the necessary Firebase functions
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage
import AsyncStorage from '@react-native-async-storage/async-storage';  // import AsyncStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaADublPtWDetKqIjIH_8WwXpYvEyB0bM",
  authDomain: "closetshare-fb324.firebaseapp.com",
  projectId: "closetshare-fb324",
  storageBucket: "closetshare-fb324.appspot.com",
  messagingSenderId: "167592496969",
  appId: "1:167592496969:web:57f621fdae721d73351498",
  databaseURL: "https://closetshare-fb324-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const firebase_auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(AsyncStorage)  // add persistence
});

// Initialize Firestore
export const db = getFirestore(firebase_app);

// Initialize Firebase Storage
export const storage = getStorage(firebase_app);

// Export the app
export { firebase_app };