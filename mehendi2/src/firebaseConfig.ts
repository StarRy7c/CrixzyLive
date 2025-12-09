// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// TODO: Replace the following config with your actual Firebase project configuration
// 1. Go to console.firebase.google.com
// 2. Create a new project "Raju Mehendi"
// 3. Enable Authentication (Google Sign-In)
// 4. Enable Firestore Database (Start in test mode)
// 5. Enable Storage (Start in test mode)
// 6. Copy the config object from Project Settings -> General -> Your Apps

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const storage = firebase.storage();
export default firebase;