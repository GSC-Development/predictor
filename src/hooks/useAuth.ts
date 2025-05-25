"use client"

import { useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  updateEmail,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { createUser, getUser, updateUser, deleteUserData } from '@/lib/firestore';
import type { User } from '@/types';

export interface AuthState {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): AuthState & {
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateUserProfile: (updates: { name?: string; email?: string }) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
} => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 Auth state changed:', {
        user: firebaseUser ? {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        } : null,
        timestamp: new Date().toISOString()
      });
      
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Load user profile from Firestore
        try {
          const profile = await getUser(firebaseUser.uid);
          console.log('📋 User profile loaded:', profile);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          setError('Failed to load user profile');
        }
      } else {
        console.log('❌ No user - clearing profile');
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Create Firebase Auth account
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, { displayName: name });
      
      // Create user profile in Firestore
      const newUserData = {
        userId: result.user.uid,
        name: name,
        email: email,
        totalPoints: 0,
        currentWeekPoints: 0,
        joinedAt: Timestamp.now()
      };
      
      await createUser(newUserData);
      
    } catch (err: unknown) {
      let errorMessage = 'Failed to create account';
      
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          errorMessage = 'An account with this email already exists';
        } else if (firebaseError.code === 'auth/weak-password') {
          errorMessage = 'Password should be at least 6 characters';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      await signInWithEmailAndPassword(auth, email, password);
      
    } catch (err: unknown) {
      let errorMessage = 'Failed to sign in';
      
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email';
        } else if (firebaseError.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        } else if (firebaseError.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed attempts. Please try again later.';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch {
      setError('Failed to sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      let errorMessage = 'Failed to send password reset email';
      
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        if (firebaseError.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email address';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setError(null);
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
    } catch (err: unknown) {
      let errorMessage = 'Failed to change password';
      
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        if (firebaseError.code === 'auth/wrong-password') {
          errorMessage = 'Current password is incorrect';
        } else if (firebaseError.code === 'auth/weak-password') {
          errorMessage = 'New password should be at least 6 characters';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUserProfile = async (updates: { name?: string; email?: string }) => {
    if (!user || !userProfile) throw new Error('No user logged in');
    
    try {
      setError(null);
      
      // Update Firebase Auth profile
      const authUpdates: { displayName?: string } = {};
      if (updates.name) authUpdates.displayName = updates.name;
      
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(user, authUpdates);
      }
      
      // Update email if provided
      if (updates.email && updates.email !== user.email) {
        await updateEmail(user, updates.email);
      }
      
      // Update Firestore profile
      const firestoreUpdates: { name?: string; email?: string } = {};
      if (updates.name) firestoreUpdates.name = updates.name;
      if (updates.email) firestoreUpdates.email = updates.email;
      
      if (Object.keys(firestoreUpdates).length > 0) {
        await updateUser(user.uid, firestoreUpdates);
        
        // Update local state
        setUserProfile(prev => prev ? { ...prev, ...firestoreUpdates } : null);
      }
      
    } catch (err: unknown) {
      let errorMessage = 'Failed to update profile';
      
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already in use by another account';
        } else if (firebaseError.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        } else if (firebaseError.code === 'auth/requires-recent-login') {
          errorMessage = 'Please sign out and sign back in before changing your email';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteAccount = async (password: string) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setError(null);
      
      // Re-authenticate user before deleting account
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      
      // Delete user data from Firestore
      await deleteUserData(user.uid);
      
      // Delete Firebase Auth account
      await deleteUser(user);
      
    } catch (err: unknown) {
      let errorMessage = 'Failed to delete account';
      
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        if (firebaseError.code === 'auth/wrong-password') {
          errorMessage = 'Password is incorrect';
        } else if (firebaseError.code === 'auth/requires-recent-login') {
          errorMessage = 'Please sign out and sign back in before deleting your account';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    logout,
    resetPassword,
    changePassword,
    updateUserProfile,
    deleteAccount
  };
}; 