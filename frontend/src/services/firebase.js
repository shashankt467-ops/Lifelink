// Firebase configuration — uses mock/demo mode when no real credentials are provided
// Replace these with your actual Firebase config to enable real authentication

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "anti-gravity-demo.firebaseapp.com",
  projectId: "anti-gravity-demo",
  storageBucket: "anti-gravity-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijk",
};

// ─── DEMO AUTH STATE ─────────────────────────────────────────────────────────
// Simulates Firebase Auth so the app works without a real Firebase project.
// Swap this with the real firebase/auth SDK when credentials are available.

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
    // Check localStorage for persisted session
    const persisted = localStorage.getItem("ag_user");
    if (persisted) {
      currentUser = JSON.parse(persisted);
      auth.currentUser = currentUser;
      callback(currentUser);
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
  await new Promise((r) => setTimeout(r, 1000)); // Simulate network delay
  const userRecord = DEMO_USERS[email.toLowerCase()];
  if (!userRecord || userRecord.password !== password) {
    throw new Error("Firebase: Error (auth/wrong-password).");
  }
  const user = {
    uid: "demo-uid-001",
    email,
    displayName: userRecord.name,
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
  await new Promise((r) => setTimeout(r, 1200));
  if (password.length < 6) throw new Error("Password must be at least 6 characters");
  const user = {
    uid: `demo-uid-${Date.now()}`,
    email,
    displayName: email.split("@")[0],
    photoURL: null,
    emailVerified: false,
  };
  currentUser = user;
  auth.currentUser = user;
  localStorage.setItem("ag_user", JSON.stringify(user));
  notifyListeners(user);
  return { user };
};

export const signInWithPopup = async (authInstance, provider) => {
  await new Promise((r) => setTimeout(r, 1500));
  const user = {
    uid: "google-uid-001",
    email: "google.user@gmail.com",
    displayName: "Google User",
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
  await new Promise((r) => setTimeout(r, 800));
  // Demo: always succeeds
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
