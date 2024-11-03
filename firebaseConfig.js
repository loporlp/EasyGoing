// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwMbpvjo4oDLTbUvpqZnl20P4hOyeBx9E",
  authDomain: "easygoing-4635d.firebaseapp.com",
  projectId: "easygoing-4635d",
  storageBucket: "easygoing-4635d.firebasestorage.app",
  messagingSenderId: "469083378053",
  appId: "1:469083378053:web:be4392fbc04adbdde9b4ec",
  measurementId: "G-MWWYNH18C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();