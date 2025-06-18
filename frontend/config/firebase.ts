// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvo3mO8lhjSoBF1SPe0sIQiFETX9Rvfco",
    authDomain: "ecom-furniture-7588d.firebaseapp.com",
    projectId: "ecom-furniture-7588d",
    storageBucket: "ecom-furniture-7588d.firebasestorage.app",
    messagingSenderId: "80309012392",
    appId: "1:80309012392:web:ad50e3ac64a9bbbe977f9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
auth.languageCode = "en"

export { auth }