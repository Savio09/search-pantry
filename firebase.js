// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQVFnEdJ9xVzXtU6fb368TQbwEAdntAt4",
  authDomain: "next-pantry-tracker.firebaseapp.com",
  projectId: "next-pantry-tracker",
  storageBucket: "next-pantry-tracker.appspot.com",
  messagingSenderId: "498894959676",
  appId: "1:498894959676:web:34b886a2aa60722edc3f39",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
