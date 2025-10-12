import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../register';
import { GoogleAuthProvider, signInWithPopup as firebaseSignInWithPopup } from 'firebase/auth';
import { 
  createUserProfile, 
  getUserProfile as getDbUserProfile, 
  updateDiamondBalance,
  addPurchasedAsset,
  findUserByUsername,
  UserProfile as DbUserProfile
} from '../services/database';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  userProfile: DbUserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserDiamonds: (amount: number) => Promise<void>;
  getUserProfile: () => Promise<void>;
  purchaseAsset: (assetId: string, cost: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<DbUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize Google provider
  const googleProvider = new GoogleAuthProvider();

  // Create user profile wrapper
  const createUserProfileWrapper = async (user: User, username?: string) => {
    console.log('AuthContext - Creating profile for user:', user.email);
    try {
      console.log('AuthContext - Calling createUserProfile...');
      await createUserProfile({
        ...user,
        displayName: username || user.displayName
      });
      
      // Get the created profile
      console.log('AuthContext - Getting created profile...');
      const profile = await getDbUserProfile(user.uid);
      console.log('AuthContext - Retrieved profile:', profile);
      if (profile) {
        setUserProfile(profile);
        console.log('AuthContext - Profile set successfully');
        toast.success('Welcome to Diamond Assets Store! 💎');
      } else {
        console.log('AuthContext - No profile returned after creation');
      }
    } catch (error: any) {
      console.error('AuthContext - Error creating user profile:', error);
      // If profile already exists, just get it
      console.log('AuthContext - Trying to get existing profile...');
      const profile = await getDbUserProfile(user.uid);
      console.log('AuthContext - Existing profile:', profile);
      if (profile) {
        setUserProfile(profile);
        console.log('AuthContext - Existing profile set successfully');
      }
    }
  };

  // Get user profile from Realtime Database
  const getUserProfile = async () => {
    if (!currentUser) return;
    
    try {
      const profile = await getDbUserProfile(currentUser.uid);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
    }
  };

  // Update user diamonds
  const updateUserDiamonds = async (amount: number) => {
    if (!currentUser || !userProfile) return;

    const newBalance = userProfile.diamondBalance + amount;
    
    if (newBalance < 0) {
      throw new Error('Insufficient diamonds');
    }

    await updateDiamondBalance(currentUser.uid, newBalance);
    setUserProfile({ ...userProfile, diamondBalance: newBalance });
  };
  
  // Purchase asset
  const purchaseAsset = async (assetId: string, cost: number) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    await addPurchasedAsset(currentUser.uid, assetId, cost);
    
    // Refresh user profile
    await getUserProfile();
  };

  // Sign up with email and password
  const signup = async (email: string, password: string, username: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: username });
      await createUserProfileWrapper(user, username);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  // Login with email and password (or username and password)
  const login = async (emailOrUsername: string, password: string) => {
    try {
      let email = emailOrUsername;
      
      console.log('Login attempt with:', emailOrUsername);
      
      // Check if input looks like an email (contains @)
      if (!emailOrUsername.includes('@')) {
        console.log('Input detected as username, searching database...');
        // It's a username, find the corresponding email
        const userProfile = await findUserByUsername(emailOrUsername);
        if (!userProfile) {
          console.log('Username not found in database');
          toast.error('Username not found');
          throw new Error('Username not found');
        }
        email = userProfile.email;
        console.log('Username found, using email:', email);
      } else {
        console.log('Input detected as email:', email);
      }
      
      console.log('Attempting Firebase Auth login...');
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase Auth successful for:', user.email);
      await createUserProfileWrapper(user);
      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error.code, error.message);
      
      if (error.message === 'Username not found') {
        toast.error('Username not found. Please check your username.');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password. Please check your credentials.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format. Please enter a valid email.');
      } else if (error.code === 'auth/user-disabled') {
        toast.error('This account has been disabled. Please contact support.');
      } else {
        toast.error('Failed to login. Please try again.');
      }
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const { user } = await firebaseSignInWithPopup(auth, googleProvider);
      await createUserProfileWrapper(user);
      toast.success('Welcome!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthContext - Auth state changed. User:', user?.email || 'No user');
      setCurrentUser(user);
      
      if (user) {
        console.log('AuthContext - User logged in, fetching profile...');
        // Get user profile directly here instead of calling getUserProfile
        try {
          const profile = await getDbUserProfile(user.uid);
          console.log('AuthContext - Profile fetched:', profile);
          if (profile) {
            setUserProfile(profile);
            console.log('AuthContext - Profile set in state');
          } else {
            console.log('AuthContext - No profile found for user');
          }
        } catch (error) {
          console.error('AuthContext - Error getting user profile:', error);
        }
      } else {
        console.log('AuthContext - No user, clearing profile');
        setUserProfile(null);
      }
      
      console.log('AuthContext - Setting loading to false');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserDiamonds,
    getUserProfile,
    purchaseAsset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};