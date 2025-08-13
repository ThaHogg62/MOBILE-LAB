
import * as firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// NOTE: Replace with your own Firebase project configuration.
// You can get this from the "Project settings" in your Firebase console.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app: firebase.app.App | null = null;
let auth: firebase.auth.Auth | null = null;

// Gracefully handle missing Firebase configuration to allow the app to run.
if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_")) {
  try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth(app);
  } catch (error) {
    console.error("Error initializing Firebase. Please check your firebaseConfig.ts.", error);
    auth = null;
  }
} else {
    // THIS IS AN INTENTIONAL WARNING FOR DEVELOPERS.
    // The app is designed to run without real Firebase keys for development purposes.
    // Authentication features will be disabled, but the rest of the app will work.
    // To enable authentication, replace the placeholder values above with your actual
    // Firebase project configuration. THIS WARNING WILL DISAPPEAR ONCE YOU DO.
    console.warn("Firebase configuration is missing or contains placeholder values in 'firebaseConfig.ts'. Authentication features will be disabled.");
}

// Export a potentially null auth object.
// The authService will handle this case to prevent crashes.
export { auth };