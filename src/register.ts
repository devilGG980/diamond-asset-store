// Firebase SDK Registration and Authentication Setup
// This file contains the Firebase configuration and setup for Video Forge

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator, Database } from 'firebase/database';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
// Storage disabled for free Firebase plan
// import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration object
// Your actual Firebase project configuration for Video Forge
const firebaseConfig = {
  apiKey: "AIzaSyBrp5VeoBI9PDEL6tdhFY-8HS10Bu48His",
  authDomain: "videoforges.firebaseapp.com",
  databaseURL: "https://videoforges-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "videoforges",
  storageBucket: "videoforges.firebasestorage.app",
  messagingSenderId: "488596362926",
  appId: "1:488596362926:web:ec443a952fd6a46f417f3f",
  measurementId: "G-FSWJD4QW19"
};

// Instructions for getting Firebase configuration:
/*
1. Go to https://console.firebase.google.com/
2. Create a new project or select existing project
3. Click on "Project settings" (gear icon)
4. Scroll down to "Your apps" section
5. Click "Add app" and select "Web"
6. Register your app with name "Video Forge"
7. Copy the configuration object and replace the values above

Example of what your config should look like:
const firebaseConfig = {
  apiKey: "AIzaSyC9x5X6YZ...",
  authDomain: "video-forge-12345.firebaseapp.com",
  projectId: "video-forge-12345",
  storageBucket: "video-forge-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-XXXXXXXXXX"
};
*/

// Initialize Firebase app
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Database = getDatabase(app);
export const firestore: Firestore = getFirestore(app);
// Storage disabled for free Firebase plan
// export const storage: FirebaseStorage = getStorage(app);

// Initialize Analytics (optional - only if you want analytics)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics not available:', error);
  }
}

// Export analytics with proper typing
export { analytics };

// Development mode setup (for local testing)
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment && typeof window !== 'undefined') {
  // Connect to Firebase emulators in development
  // Uncomment these lines if you want to use Firebase emulators for local development
  
  // try {
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  //   console.log('Connected to Auth emulator');
  // } catch (error) {
  //   console.log('Auth emulator connection failed:', error);
  // }
  
  // try {
  //   connectDatabaseEmulator(db, 'localhost', 9000);
  //   console.log('Connected to Realtime Database emulator');
  // } catch (error) {
  //   console.log('Realtime Database emulator connection failed:', error);
  // }
  
  // Storage emulator disabled (free plan)
  // try {
  //   connectStorageEmulator(storage, 'localhost', 9199);
  //   console.log('Connected to Storage emulator');
  // } catch (error) {
  //   console.log('Storage emulator connection failed:', error);
  // }
}

// Export the Firebase app instance
export default app;

// Helper functions for common Firebase operations
export const getCurrentUser = () => {
  return auth.currentUser;
};

export const isUserSignedIn = (): boolean => {
  return !!auth.currentUser;
};

// Configuration status check
export const isConfigured = (): boolean => {
  return firebaseConfig.apiKey !== 'your-api-key-here' && 
         firebaseConfig.projectId !== 'your-project-id';
};

// Development helper - logs configuration status
if (isDevelopment) {
  console.log('Firebase Configuration Status:', {
    configured: isConfigured(),
    services: {
      auth: !!auth,
      database: !!db,
      storage: 'disabled (free plan)',
      analytics: !!analytics
    }
  });
  
  if (!isConfigured()) {
    console.warn(`
🔥 FIREBASE SETUP REQUIRED 🔥

Your Firebase configuration is not set up yet. Please:

1. Go to https://console.firebase.google.com/
2. Create a new project called "Video Forge"
3. Enable Authentication (Email/Password and Google)
4. Enable Realtime Database
5. Copy your config from Project Settings
7. Replace the placeholder values in src/register.ts

Current config status: NOT CONFIGURED
    `);
  }
}