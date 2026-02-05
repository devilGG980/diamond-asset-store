# Firebase Google Authentication Setup

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `qwrbq2rv`
3. Go to **Project Settings** (gear icon) > **General** tab
4. Scroll down to **Your apps** section
5. If you don't have a web app, click **Add app** > **Web** (</> icon)
6. Register your app with name: "Diamond Assets Store"
7. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "qwrbq2rv.firebaseapp.com",
  databaseURL: "https://qwrbq2rv-default-rtdb.firebaseio.com/",
  projectId: "qwrbq2rv",
  storageBucket: "qwrbq2rv.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 2: Update .env File

Replace the placeholder values in `.env` file with your actual Firebase config values:

```env
REACT_APP_FIREBASE_API_KEY=your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=qwrbq2rv.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://qwrbq2rv-default-rtdb.firebaseio.com/
REACT_APP_FIREBASE_PROJECT_ID=qwrbq2rv
REACT_APP_FIREBASE_STORAGE_BUCKET=qwrbq2rv.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Step 3: Enable Google Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Click **Enable**
4. Add your project support email
5. Add authorized domains if needed (localhost is enabled by default)
6. Save the configuration

## Step 4: Enable Realtime Database (if needed)

1. Go to **Realtime Database** in Firebase Console
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select a location (us-central1 recommended)

## Step 5: Set Database Rules (Optional for development)

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "transactions": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Step 6: Test the Setup

After updating the .env file, restart your development server and test the Google sign-in functionality.

## Troubleshooting

- Make sure to restart your development server after updating .env
- Check browser console for any Firebase configuration errors
- Ensure your domain is added to Firebase authorized domains
- Verify that Google sign-in is enabled in Firebase Console