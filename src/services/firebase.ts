// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCR3ecAOLbt1HQ2CLOTGQPWE6DIn7tmUkk",
  authDomain: "autism-support-web.firebaseapp.com",
  projectId: "autism-support-web",
  storageBucket: "autism-support-web.firebasestorage.app",
  messagingSenderId: "687170957435",
  appId: "1:687170957435:web:3045946a5036099d2632de",
  measurementId: "G-9YXWS8MB1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);