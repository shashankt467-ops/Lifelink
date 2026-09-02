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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForProductionAuth12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lifelink-healthcare.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lifelink-healthcare",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lifelink-healthcare.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "10987654321",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:10987654321:web:1234567890abcdef",
};

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

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
    throw err;
  }
};

export const createUserWithEmailAndPassword = async (authObj, email, password) => {
  const cleanEmail = (email || '').toLowerCase().trim();
  try {
    const result = await fbCreateUserWithEmailAndPassword(authInstance, cleanEmail, password);
    return result;
  } catch (err) {
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
    // Force Google Account Chooser screen to open every time
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  }
  try {
    const result = await fbSignInWithPopup(authInstance, googleProvider);
    return result;
  } catch (err) {
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
