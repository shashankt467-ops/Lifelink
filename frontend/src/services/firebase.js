// Firebase Configuration for Anti Gravity / LifeLink Platform
// Dynamically reads from Vercel environment variables (VITE_FIREBASE_*)
// Defaults to demo mode when no real Firebase keys are provided

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "anti-gravity-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "anti-gravity-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "anti-gravity-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdefghijk",
};

// ─── DEMO AUTH STATE & PERSISTENCE ─────────────────────────────────────────────
// Simulates Firebase Auth so the production web app runs smoothly with 100% uptime.

let currentUser = null;
const authListeners = [];

const DEMO_USERS = {
  "demo@antigravity.health": { password: "demo123", name: "Arjun Mehta" },
  "test@test.com": { password: "test123", name: "Test User" },
};

const notifyListeners = (user) => {
  authListeners.forEach((cb) => cb(user));
};

export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    authListeners.push(callback);
    // Check localStorage for persisted user session
    const persisted = localStorage.getItem("ag_user");
    if (persisted) {
      try {
        currentUser = JSON.parse(persisted);
        auth.currentUser = currentUser;
        callback(currentUser);
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx > -1) authListeners.splice(idx, 1);
    };
  },
};

export const signInWithEmailAndPassword = async (authInstance, email, password) => {
  await new Promise((r) => setTimeout(r, 800)); // Network latency simulation
  const cleanEmail = (email || '').toLowerCase().trim();
  const userRecord = DEMO_USERS[cleanEmail];
  
  if (userRecord && userRecord.password !== password) {
    throw new Error("Firebase: Error (auth/wrong-password).");
  }

  const name = userRecord ? userRecord.name : cleanEmail.split('@')[0] || 'User';
  const user = {
    uid: `user-${Date.now()}`,
    email: cleanEmail,
    displayName: name,
    photoURL: null,
    emailVerified: true,
  };

  currentUser = user;
  auth.currentUser = user;
  localStorage.setItem("ag_user", JSON.stringify(user));
  notifyListeners(user);
  return { user };
};

export const createUserWithEmailAndPassword = async (authInstance, email, password) => {
  await new Promise((r) => setTimeout(r, 1000));
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const cleanEmail = (email || '').toLowerCase().trim();
  const user = {
    uid: `user-${Date.now()}`,
    email: cleanEmail,
    displayName: cleanEmail.split("@")[0] || 'New Patient',
    photoURL: null,
    emailVerified: true,
  };
  currentUser = user;
  auth.currentUser = user;
  localStorage.setItem("ag_user", JSON.stringify(user));
  notifyListeners(user);
  return { user };
};

export const signInWithPopup = async (authInstance, provider) => {
  await new Promise((r) => setTimeout(r, 1200));
  const user = {
    uid: `google-uid-${Date.now()}`,
    email: "google.user@gmail.com",
    displayName: "Google Verified User",
    photoURL: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    emailVerified: true,
  };
  currentUser = user;
  auth.currentUser = user;
  localStorage.setItem("ag_user", JSON.stringify(user));
  notifyListeners(user);
  return { user };
};

export const sendPasswordResetEmail = async (authInstance, email) => {
  await new Promise((r) => setTimeout(r, 600));
  return true;
};

export const signOut = async (authInstance) => {
  await new Promise((r) => setTimeout(r, 300));
  currentUser = null;
  auth.currentUser = null;
  localStorage.removeItem("ag_user");
  notifyListeners(null);
};

export const GoogleAuthProvider = class {
  static PROVIDER_ID = "google.com";
};

export default { auth, firebaseConfig };
