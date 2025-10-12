# Firebase Setup Instructions for Video Forge

Follow these steps to set up Firebase authentication for your Video Forge application.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **Video Forge** (or any name you prefer)
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web** icon (`</>`)
2. Enter app nickname: **Video Forge Web App**
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the configuration object that appears

## Step 3: Configure Firebase Services

### Enable Authentication
1. In the Firebase console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Enable **Google** authentication (add your domain if needed)

### Enable Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select a location (closest to your users)

### Enable Storage
1. Go to **Storage** → **Get started**
2. Choose **Start in test mode**
3. Select the same location as Firestore

## Step 4: Update Your Configuration

1. Open `src/register.js` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com", 
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
  measurementId: "your-measurement-id" // Optional
};
```

## Step 5: Set Firestore Security Rules

In the Firebase console, go to **Firestore Database** → **Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Everyone can read assets (for browsing)
    match /assets/{assetId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can add assets
    }
  }
}
```

## Step 6: Set Storage Security Rules

In the Firebase console, go to **Storage** → **Rules** and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /assets/{allPaths=**} {
      allow read: if true; // Anyone can read assets
      allow write: if request.auth != null; // Only authenticated users can upload
    }
  }
}
```

## Step 7: Test Your Setup

1. Start your development server: `npm start`
2. Check the browser console for Firebase status messages
3. Try registering a new account
4. Try logging in with existing account
5. Try Google authentication

## Troubleshooting

### Common Issues:

**"Firebase: Error (auth/invalid-api-key)"**
- Check that your `apiKey` is correctly copied from Firebase console

**"Firebase: Error (auth/invalid-domain)"**
- In Firebase console, go to Authentication → Settings → Authorized domains
- Add `localhost` for development

**"Firebase: Error (firestore/permission-denied)"**
- Check your Firestore security rules
- Make sure the user is authenticated

**"Import errors"**
- Make sure all Firebase packages are installed: `npm install firebase`

### Environment Variables (Optional)

For better security in production, you can use environment variables:

1. Create a `.env` file in your project root
2. Add your Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

3. Update `register.js` to use environment variables:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
```

## Next Steps

After completing the setup:
1. Test user registration and authentication
2. Upload some sample video assets to test the store
3. Set up production environment with proper security rules
4. Consider adding additional authentication providers (Facebook, Twitter, etc.)

Need help? Check the [Firebase documentation](https://firebase.google.com/docs) or the Video Forge project README.