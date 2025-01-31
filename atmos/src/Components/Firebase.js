// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDxpLuYU4-csyE-CePELdEs-4ydLDTa6Q0",
    authDomain: "urban-computing-abhi-f2642.firebaseapp.com",
    projectId: "urban-computing-abhi-f2642",
    storageBucket: "urban-computing-abhi-f2642.firebasestorage.app",
    messagingSenderId: "13763706058",
    appId: "1:13763706058:web:cabc36cc67d5e7d9eb4833",
    measurementId: "G-9J3ZKBBZPR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
