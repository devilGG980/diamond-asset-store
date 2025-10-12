<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBrp5VeoBI9PDEL6tdhFY-8HS10Bu48His",
    authDomain: "videoforges.firebaseapp.com",
    projectId: "videoforges",
    storageBucket: "videoforges.firebasestorage.app",
    messagingSenderId: "488596362926",
    appId: "1:488596362926:web:ec443a952fd6a46f417f3f",
    measurementId: "G-FSWJD4QW19"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
