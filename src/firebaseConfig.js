// src/firebaseConfig.js

// Import the necessary Firebase functions
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaADublPtWDetKqIjIH_8WwXpYvEyB0bM",
  authDomain: "closetshare-fb324.firebaseapp.com",
  projectId: "closetshare-fb324",
  storageBucket: "closetshare-fb324.appspot.com",
  messagingSenderId: "167592496969",
  appId: "1:167592496969:web:57f621fdae721d73351498"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication
const auth = getAuth(app);
export { auth };
