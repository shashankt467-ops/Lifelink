// Production Firebase Authentication & Services for LifeLink Platform
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  signInWithPopup as fbSignInWithPopup,
  signOut as fbSignOut,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  GoogleAuthProvider as FbGoogleAuthProvider,
  onAuthStateChanged as fbOnAuthStateChanged,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn('[Firebase Auth] VITE_FIREBASE_API_KEY environment variable is missing in .env');
}

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig.apiKey ? firebaseConfig : {
  apiKey: "AIzaSyDummyKeyForProductionAuth12345",
  authDomain: "lifelink-healthcare.firebaseapp.com",
  projectId: "lifelink-healthcare",
  storageBucket: "lifelink-healthcare.appspot.com",
  messagingSenderId: "10987654321",
  appId: "1:10987654321:web:1234567890abcdef",
});

export const authInstance = getAuth(app);

export const auth = {
  get currentUser() {
    return authInstance.currentUser;
  },
  onAuthStateChanged: (callback) => {
    return fbOnAuthStateChanged(authInstance, (user) => {
      callback(user);
    });
  },
};

export const signInWithEmailAndPassword = async (authObj, email, password) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  try {
    const result = await fbSignInWithEmailAndPassword(authInstance, cleanEmail, password);
    return result;
  } catch (err) {
    console.error("FIREBASE EMAIL LOGIN ERROR:", {
      code: err.code,
      message: err.message,
      name: err.name,
    });
    throw err;
  }
};

export const createUserWithEmailAndPassword = async (authObj, email, password) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  try {
    const result = await fbCreateUserWithEmailAndPassword(authInstance, cleanEmail, password);
    return result;
  } catch (err) {
    console.error("FIREBASE SIGNUP ERROR:", {
      code: err.code,
      message: err.message,
      name: err.name,
    });
    throw err;
  }
};

export const updateProfile = async (user, profileData) => {
  try {
    await fbUpdateProfile(user, profileData);
  } catch (err) {
    console.warn('Firebase profile update warning:', err);
  }
};

export const signInWithPopup = async (authObj, provider) => {
  const googleProvider = provider || new FbGoogleAuthProvider();
  if (googleProvider.setCustomParameters) {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  }
  try {
    const result = await fbSignInWithPopup(authInstance, googleProvider);
    return result;
  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", {
      code: err.code,
      message: err.message,
      name: err.name,
      stack: err.stack,
    });
    throw err;
  }
};

export const sendPasswordResetEmail = async (authObj, email) => {
  return await fbSendPasswordResetEmail(authInstance, email);
};

export const signOut = async (authObj) => {
  await fbSignOut(authInstance);
};

export const GoogleAuthProvider = FbGoogleAuthProvider;

export default { auth, firebaseConfig };
