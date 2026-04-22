// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBe3fwd02ym5tZSnNr2KRS-8M858jDbelM",
    authDomain: "trustpay-d614d.firebaseapp.com",
    projectId: "trustpay-d614d",
    storageBucket: "trustpay-d614d.firebasestorage.app",
    messagingSenderId: "629239117053",
    appId: "1:629239117053:web:cee8a4b3dd640a7d603a94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);