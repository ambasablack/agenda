// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAkl5RW_M0n0BKOqKX404CDTYTvTA4gvI8",
  authDomain: "agendacultural-68b06.firebaseapp.com",
  projectId: "agendacultural-68b06",
  storageBucket: "agendacultural-68b06.firebasestorage.app",
  messagingSenderId: "83352002566",
  appId: "1:83352002566:web:f7be6fc1ec26dbc6ae2387",
  measurementId: "G-Y9FKLQXTW7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
