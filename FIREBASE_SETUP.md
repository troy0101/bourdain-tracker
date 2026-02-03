# Firebase Setup Instructions

Your Bourdain Map now has authentication and cloud sync! Here's how to complete the setup:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "Bourdain Map" (or anything you like)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left menu
2. Click "Get started"
3. Click "Sign-in method" tab
4. Enable "Google" provider
5. Add your email as an authorized domain if needed

## Step 3: Enable Firestore Database

1. Click "Firestore Database" in the left menu
2. Click "Create database"
3. Choose "Start in test mode" (for now)
4. Select a location close to you
5. Click "Enable"

## Step 4: Set Firestore Rules

In Firestore, go to the "Rules" tab and paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures users can only read/write their own data.

## Step 5: Get Your Firebase Config

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register your app (name it "Bourdain Map Web")
6. Copy the `firebaseConfig` object

## Step 6: Update firebase-config.js

Open `firebase-config.js` and replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};
```

## Step 7: Test It!

1. Refresh your browser
2. Click "Sign In" in the header
3. Sign in with your Google account
4. Mark some restaurants as visited
5. Sign out and sign back in - your selections should be saved!

## Features Now Available:

✅ **Google Sign-In** - Secure authentication
✅ **Cloud Sync** - Your visited restaurants saved to Firebase
✅ **Multi-Device** - Access your list from any device
✅ **Automatic Migration** - LocalStorage data moves to cloud on first sign-in
✅ **Offline Fallback** - Works without sign-in using localStorage

---

**Note:** Firebase free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage
- 10GB bandwidth/month

Perfect for personal use! 🎉
