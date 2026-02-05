<script type="module">
  // Import the functions you need from the SDKs you need
  import {initializeApp} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import {getAnalytics} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
</script>
