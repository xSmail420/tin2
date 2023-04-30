// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDJ9sVtJnU-4wW4Aku9ERk2BujnGftD7mM",
  authDomain: "tin2-385301.firebaseapp.com",
  projectId: "tin2-385301",
  storageBucket: "tin2-385301.appspot.com",
  messagingSenderId: "76532762222",
  appId: "1:76532762222:web:1cfe330c02164f15bb887f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
