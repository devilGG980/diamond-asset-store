import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';
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

  // Create user profile wrapper
  const createUserProfileWrapper = async (user: User, username?: string) => {
    console.log('AuthContext - Creating profile for user:', user.email);
    try {
      console.log('AuthContext - Calling createUserProfile...');
      
      // Update user metadata if username is provided
      if (username) {
        await supabase.auth.updateUser({
          data: { displayName: username }
        });
      }
      
      await createUserProfile(user);
      
      // Get the created profile
      console.log('AuthContext - Getting created profile...');
      const profile = await getDbUserProfile(user.id);
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
      const profile = await getDbUserProfile(user.id);
      console.log('AuthContext - Existing profile:', profile);
      if (profile) {
        setUserProfile(profile);
        console.log('AuthContext - Existing profile set successfully');
      }
    }
  };

  // Get user profile from Database
  const getUserProfile = async () => {
    if (!currentUser) return;
    
    try {
      const profile = await getDbUserProfile(currentUser.id);
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

    await updateDiamondBalance(currentUser.id, newBalance);
    setUserProfile({ ...userProfile, diamondBalance: newBalance });
  };
  
  // Purchase asset
  const purchaseAsset = async (assetId: string, cost: number) => {
    if (!currentUser) throw new Error('User not authenticated');
    
    await addPurchasedAsset(currentUser.id, assetId, cost);
    
    // Refresh user profile
    await getUserProfile();
  };

  // Sign up with email and password
  const signup = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: username
          }
        }
      });
      
      if (error) throw error;
      if (data.user) {
        await createUserProfileWrapper(data.user, username);
        toast.success('Account created successfully!');
      }
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
      
      console.log('Attempting Supabase Auth login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log('Supabase Auth successful for:', data.user?.email);
      if (data.user) {
        await createUserProfileWrapper(data.user);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      
      if (error.message === 'Username not found') {
        toast.error('Username not found. Please check your username.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email address.');
      } else {
        toast.error('Failed to login. Please try again.');
      }
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      // User will be redirected to Google, and profile will be created on return
      toast.success('Redirecting to Google...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      console.log('AuthContext - Auth state changed. User:', user?.email || 'No user');
      setCurrentUser(user);
      
      if (user) {
        console.log('AuthContext - User logged in, fetching profile...');
        // Get user profile directly here instead of calling getUserProfile
        try {
          const profile = await getDbUserProfile(user.id);
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

    return () => {
      subscription.unsubscribe();
    };
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