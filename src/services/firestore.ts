// Firestore Database Service
// Handles all user data operations for Diamond Assets Store using Firestore

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { firestore, auth } from '../register';

// Test Firestore connection
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Firestore connection...');
    const testRef = doc(firestore, 'test', 'connection');
    await getDoc(testRef);
    console.log('✅ Firestore connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return false;
  }
};

// User profile interface for Firestore
export interface FirestoreUserProfile {
  uid: string;
  email: string;
  displayName?: string;
  diamondBalance: number;
  purchasedAssets: string[];
  lastAdWatch?: any; // Firestore timestamp
  adsWatchedToday: number;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
}

// Collection names
const USERS_COLLECTION = 'users';

// Create user profile when they first sign up
export const createFirestoreUserProfile = async (user: any): Promise<void> => {
  console.log('Firestore - Creating profile for user:', user.email, user.uid);
  const userRef = doc(firestore, USERS_COLLECTION, user.uid);
  
  // Check if user already exists
  console.log('Firestore - Checking if user exists...');
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    console.log('Firestore - User profile already exists');
    return;
  }

  // Create new user profile
  const userProfile: FirestoreUserProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    diamondBalance: 0, // No starting diamonds
    purchasedAssets: [],
    adsWatchedToday: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(userRef, userProfile);
    console.log('User profile created successfully in Firestore');
  } catch (error: any) {
    console.error('Error creating user profile in Firestore:', error);
    
    // Check for specific Firestore errors
    if (error.code === 'failed-precondition') {
      console.error('🚨 FIRESTORE DATABASE NOT CREATED! Cannot create user profile.');
      alert('Cannot create user profile: Firestore database not set up. Please contact support.');
    } else if (error.code === 'permission-denied') {
      console.error('🚨 FIRESTORE PERMISSION DENIED! Cannot create user profile.');
    }
    
    // Don't throw error to prevent app crash - user can still use the app without diamond balance
    return;
  }
};

// Get user profile by UID
export const getFirestoreUserProfile = async (uid: string): Promise<FirestoreUserProfile | null> => {
  console.log('Firestore - Getting profile for UID:', uid);
  try {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    console.log('Firestore - Fetching document...');
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const profile = docSnap.data() as FirestoreUserProfile;
      console.log('Firestore - Profile found:', profile);
      return profile;
    }
    console.log('Firestore - No profile document found');
    return null;
  } catch (error: any) {
    console.error('Firestore - Error getting user profile:', error);
    
    // Check for specific Firestore errors
    if (error.code === 'failed-precondition') {
      console.error('🚨 FIRESTORE DATABASE NOT CREATED! Please create Firestore database in Firebase Console.');
      alert('Diamond balance unavailable: Firestore database not set up. Please contact support.');
    } else if (error.code === 'permission-denied') {
      console.error('🚨 FIRESTORE PERMISSION DENIED! Check Firestore security rules.');
    }
    
    return null; // Return null instead of throwing to prevent app crash
  }
};

// Get user profile by email (useful for admin or search features)
export const getFirestoreUserProfileByEmail = async (email: string): Promise<FirestoreUserProfile | null> => {
  try {
    const q = query(collection(firestore, USERS_COLLECTION), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as FirestoreUserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile by email from Firestore:', error);
    throw error;
  }
};

// Update user's diamond balance
export const updateFirestoreDiamondBalance = async (uid: string, newBalance: number): Promise<void> => {
  try {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    await updateDoc(userRef, { 
      diamondBalance: newBalance,
      updatedAt: serverTimestamp()
    });
    console.log('Diamond balance updated successfully in Firestore');
  } catch (error) {
    console.error('Error updating diamond balance in Firestore:', error);
    throw error;
  }
};

// Add diamonds to user's balance (useful for rewards)
export const addFirestoreDiamonds = async (uid: string, amount: number): Promise<void> => {
  try {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    await updateDoc(userRef, { 
      diamondBalance: increment(amount),
      updatedAt: serverTimestamp()
    });
    console.log(`Added ${amount} diamonds successfully in Firestore`);
  } catch (error) {
    console.error('Error adding diamonds in Firestore:', error);
    throw error;
  }
};

// Add purchased asset to user's collection
export const addFirestorePurchasedAsset = async (uid: string, assetId: string, cost: number): Promise<void> => {
  try {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found in Firestore');
    }
    
    const userData = userDoc.data() as FirestoreUserProfile;
    
    // Check if user has enough diamonds
    if (userData.diamondBalance < cost) {
      throw new Error('Insufficient diamond balance');
    }
    
    // Check if already purchased
    if (userData.purchasedAssets.includes(assetId)) {
      throw new Error('Asset already purchased');
    }
    
    // Update user data: add asset and deduct diamonds
    await updateDoc(userRef, {
      purchasedAssets: arrayUnion(assetId),
      diamondBalance: increment(-cost),
      updatedAt: serverTimestamp()
    });
    
    console.log('Asset purchased successfully in Firestore');
  } catch (error) {
    console.error('Error purchasing asset in Firestore:', error);
    throw error;
  }
};

// Reward diamonds for watching ads
export const rewardFirestoreDiamonds = async (uid: string, rewardAmount: number): Promise<void> => {
  try {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found in Firestore');
    }
    
    const userData = userDoc.data() as FirestoreUserProfile;
    const today = new Date().toDateString();
    const lastAdWatch = userData.lastAdWatch ? userData.lastAdWatch.toDate().toDateString() : '';
    
    // Reset daily count if it's a new day
    let adsWatchedToday = userData.adsWatchedToday || 0;
    if (today !== lastAdWatch) {
      adsWatchedToday = 0;
    }
    
    // Check daily limit (let's say 10 ads per day)
    if (adsWatchedToday >= 10) {
      throw new Error('Daily ad limit reached');
    }
    
    // Update user data
    await updateDoc(userRef, {
      diamondBalance: increment(rewardAmount),
      adsWatchedToday: adsWatchedToday + 1,
      lastAdWatch: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Diamonds rewarded successfully in Firestore');
  } catch (error) {
    console.error('Error rewarding diamonds in Firestore:', error);
    throw error;
  }
};

// Get current user's profile (helper function)
export const getCurrentFirestoreUserProfile = async (): Promise<FirestoreUserProfile | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }
  return await getFirestoreUserProfile(currentUser.uid);
};

// Update user display name
export const updateFirestoreDisplayName = async (uid: string, displayName: string): Promise<void> => {
  try {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    await updateDoc(userRef, { 
      displayName,
      updatedAt: serverTimestamp()
    });
    console.log('Display name updated successfully in Firestore');
  } catch (error) {
    console.error('Error updating display name in Firestore:', error);
    throw error;
  }
};

// Helper function to migrate data from Realtime Database to Firestore (if needed)
export const migrateUserToFirestore = async (uid: string, realtimeDbData: any): Promise<void> => {
  try {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    
    const firestoreData: FirestoreUserProfile = {
      uid: realtimeDbData.uid,
      email: realtimeDbData.email,
      displayName: realtimeDbData.displayName,
      diamondBalance: realtimeDbData.diamondBalance || 0,
      purchasedAssets: realtimeDbData.purchasedAssets || [],
      adsWatchedToday: realtimeDbData.adsWatchedToday || 0,
      createdAt: realtimeDbData.createdAt ? new Date(realtimeDbData.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userRef, firestoreData);
    console.log('User data migrated to Firestore successfully');
  } catch (error) {
    console.error('Error migrating user to Firestore:', error);
    throw error;
  }
};