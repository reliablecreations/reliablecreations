// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDovu4-C5uKccQBGf8EdQxXDIDb0Qvekg8",
    authDomain: "reliablecreations-bfcd0.firebaseapp.com",
    projectId: "reliablecreations-bfcd0",
    storageBucket: "reliablecreations-bfcd0.firebasestorage.app",
    messagingSenderId: "568001869555",
    appId: "1:568001869555:web:ecfb5a81397c28f5a72986"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
auth.languageCode = "en"
export { auth }
