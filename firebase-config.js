// Firebase Configuration
// Using environment variables for production
// Local development: these will fall back to placeholder values

const firebaseConfig = {
    apiKey: "AIzaSyB-zjYGD7bUgTv2DBCSR6wHPngf1gQKO_w",
    authDomain: "bourdain-tracker.firebaseapp.com",
    projectId: "bourdain-tracker",
    storageBucket: "bourdain-tracker.firebasestorage.app",
    messagingSenderId: "556182737579",
    appId: "1:556182737579:web:bff5369ef140f0dc47ddee"
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
