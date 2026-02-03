// Firebase Configuration
// IMPORTANT: Replace these values with your own Firebase project credentials
// Get them from: https://console.firebase.google.com/

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let db = null;
let auth = null;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.warn('⚠️ Firebase not configured. Using localStorage only.', error);
}

// Export for use in other files
window.firebaseDB = db;
window.firebaseAuth = auth;
