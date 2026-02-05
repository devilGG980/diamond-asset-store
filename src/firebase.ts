import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMgsHxMQL2tmRNSK2F6tpVNZWrPk-qCdg",
    authDomain: "creatorvault2e2e.firebaseapp.com",
    projectId: "creatorvault2e2e",
    storageBucket: "creatorvault2e2e.firebasestorage.app",
    messagingSenderId: "909490842872",
    appId: "1:909490842872:web:dc70c9e96e8c097a921f0d",
    measurementId: "G-PBN3QP02NJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
