// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGNpv5FFfdjymlMhyL8azyY-JlB_ccLFo",
  authDomain: "rollinindough-4f9a6.firebaseapp.com",
  projectId: "rollinindough-4f9a6",
  storageBucket: "rollinindough-4f9a6.firebasestorage.app",
  messagingSenderId: "170661655301",
  appId: "1:170661655301:web:ad12656e49a29deadafd6c",
  measurementId: "G-B2724DVXKW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

// Set up the Google provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
