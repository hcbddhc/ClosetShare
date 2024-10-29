// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize the database

export { database }; // Export the database instance