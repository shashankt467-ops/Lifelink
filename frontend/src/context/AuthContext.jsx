import { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
} from '../services/firebase';
import { usersService } from '../services/firestore/services';
import { dbStore } from '../services/firestore/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        // Fetch or create user record in Firestore / dbStore
        let profile = usersService.getUserProfile(fbUser.uid);
        if (!profile) {
          profile = usersService.saveUserProfile(fbUser.uid, {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Patient',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || null,
            provider: fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          });
        } else {
          // Update last login timestamp
          usersService.saveUserProfile(fbUser.uid, {
            ...profile,
            lastLoginAt: new Date().toISOString(),
          });
        }

        const combinedUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || profile.displayName || profile.name || fbUser.email?.split('@')[0],
          photoURL: fbUser.photoURL || profile.photoURL || null,
          emailVerified: fbUser.emailVerified,
          provider: profile.provider || 'firebase',
        };
        setUser(combinedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    if (res?.user) {
      usersService.saveUserProfile(res.user.uid, {
        uid: res.user.uid,
        name: res.user.displayName || email.split('@')[0],
        email: res.user.email,
        photoURL: res.user.photoURL || null,
        provider: 'password',
        lastLoginAt: new Date().toISOString(),
      });
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res?.user) {
      // 1. Update Firebase Auth display name
      if (name) {
        await updateProfile(res.user, { displayName: name });
      }
      // 2. Create Firestore user profile
      const userProfile = {
        uid: res.user.uid,
        displayName: name || email.split('@')[0],
        name: name || email.split('@')[0],
        email: res.user.email,
        photoURL: null,
        provider: 'password',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      usersService.saveUserProfile(res.user.uid, userProfile);
      
      setUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: name,
        photoURL: null,
        provider: 'password',
      });
    }
    return res;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, provider);
    if (res?.user) {
      const googleProfile = {
        uid: res.user.uid,
        displayName: res.user.displayName || res.user.email?.split('@')[0],
        name: res.user.displayName || res.user.email?.split('@')[0],
        email: res.user.email,
        photoURL: res.user.photoURL || null,
        provider: 'google',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      usersService.saveUserProfile(res.user.uid, googleProfile);
      setUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || res.user.email?.split('@')[0],
        photoURL: res.user.photoURL || null,
        provider: 'google',
      });
    }
    return res;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
