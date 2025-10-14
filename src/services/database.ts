// Supabase Database Service
// Handles all user data operations for Diamond Assets Store

import { supabase } from '../config/supabase';

// Purchase record with download count
export interface PurchaseRecord {
  assetId: string;
  purchaseTime: number;
  downloadsUsed: number;
  maxDownloads: number;
  cost: number;
}

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  diamondBalance: number;
  purchasedAssets: string[]; // Keep for backward compatibility
  downloadPurchases: PurchaseRecord[]; // New download-limited purchase system
  lastAdWatch?: number;
  adsWatchedToday: number;
  createdAt: number;
}

// Create user profile when they first sign up
export const createUserProfile = async (user: any): Promise<void> => {
  // Check if user already exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('uid', user.id)
    .single();
  
  if (existingProfile) {
    console.log('User profile already exists');
    return;
  }

  // Create new user profile
  const userProfile: Omit<UserProfile, 'createdAt'> & { createdAt: string } = {
    uid: user.id,
    email: user.email,
    displayName: user.user_metadata?.displayName || user.email.split('@')[0],
    diamondBalance: 0, // No starting diamonds
    purchasedAssets: [], // Keep for backward compatibility
    downloadPurchases: [], // New download-limited purchase system
    adsWatchedToday: 0,
    createdAt: new Date().toISOString()
  };

  try {
    const { error } = await supabase
      .from('users')
      .insert([userProfile]);
    
    if (error) throw error;
    console.log('User profile created successfully');
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    console.log('Database - Getting user profile for UID:', uid);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();
    
    if (error) {
      console.log('Database - Error fetching user profile:', error);
      if (error.code === 'PGRST116') {
        // Row not found
        console.log('Database - User profile not found for UID:', uid);
        return null;
      }
      throw error;
    }
    
    console.log('Database - User profile fetched:', data);
    
    // Convert string createdAt to number for compatibility
    if (data && typeof data.createdAt === 'string') {
      data.createdAt = new Date(data.createdAt).getTime();
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Find user by username
export const findUserByUsername = async (username: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('displayName', username)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Row not found
        return null;
      }
      throw error;
    }
    
    // Convert string createdAt to number for compatibility
    if (data && typeof data.createdAt === 'string') {
      data.createdAt = new Date(data.createdAt).getTime();
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
};

// Update user's diamond balance
export const updateDiamondBalance = async (uid: string, newBalance: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ diamondBalance: newBalance })
      .eq('uid', uid);
    
    if (error) throw error;
    console.log('Diamond balance updated successfully');
  } catch (error) {
    console.error('Error updating diamond balance:', error);
    throw error;
  }
};

// Add purchased asset to user's collection with 2-download limit
export const addPurchasedAsset = async (uid: string, assetId: string, cost: number): Promise<void> => {
  try {
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();
    
    if (fetchError || !userData) {
      throw new Error('User profile not found');
    }
    
    // Check if user has enough diamonds
    if (userData.diamondBalance < cost) {
      throw new Error('Insufficient diamond balance');
    }
    
    // Initialize arrays if they don't exist (for existing users)
    const currentDownloadPurchases = userData.downloadPurchases || [];
    
    // Check if asset already has active downloads remaining
    const existingPurchase = currentDownloadPurchases.find((purchase: PurchaseRecord) => purchase.assetId === assetId);
    if (existingPurchase && existingPurchase.downloadsUsed < existingPurchase.maxDownloads) {
      throw new Error('Asset already purchased with downloads remaining');
    }
    
    // Create new download purchase record (2 downloads max)
    const purchaseTime = Date.now();
    
    const newPurchase: PurchaseRecord = {
      assetId,
      purchaseTime,
      downloadsUsed: 0,
      maxDownloads: 2, // Allow 2 downloads
      cost
    };
    
    // Remove old purchase record if it exists (downloads exhausted)
    const updatedDownloadPurchases = currentDownloadPurchases.filter((purchase: PurchaseRecord) => purchase.assetId !== assetId);
    updatedDownloadPurchases.push(newPurchase);
    
    const newBalance = userData.diamondBalance - cost;
    
    const { error } = await supabase
      .from('users')
      .update({
        downloadPurchases: updatedDownloadPurchases,
        diamondBalance: newBalance
      })
      .eq('uid', uid);
    
    if (error) throw error;
    console.log('Asset purchased successfully with 2-download limit');
  } catch (error) {
    console.error('Error purchasing asset:', error);
    throw error;
  }
};

// Reward diamonds for watching ads
export const rewardDiamonds = async (uid: string, rewardAmount: number): Promise<void> => {
  try {
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();
    
    if (fetchError || !userData) {
      throw new Error('User profile not found');
    }
    
    const today = new Date().toDateString();
    const lastAdWatch = userData.lastAdWatch ? new Date(userData.lastAdWatch).toDateString() : '';
    
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
    const { error } = await supabase
      .from('users')
      .update({
        diamondBalance: userData.diamondBalance + rewardAmount,
        adsWatchedToday: adsWatchedToday + 1,
        lastAdWatch: Date.now()
      })
      .eq('uid', uid);
    
    if (error) throw error;
    console.log('Diamonds rewarded successfully');
  } catch (error) {
    console.error('Error rewarding diamonds:', error);
    throw error;
  }
};

// Check if user has active access to an asset (download limits)
export const hasActiveAssetAccess = (userProfile: UserProfile, assetId: string): boolean => {
  // Check download purchases - user has access if downloads remaining
  if (userProfile.downloadPurchases) {
    const purchase = userProfile.downloadPurchases.find(
      purchase => purchase.assetId === assetId
    );
    return !!(purchase && purchase.downloadsUsed < purchase.maxDownloads);
  }
  
  return false;
};

// Get remaining downloads for an asset
export const getRemainingDownloads = (userProfile: UserProfile, assetId: string): number => {
  // Check download purchases
  if (userProfile.downloadPurchases) {
    const purchase = userProfile.downloadPurchases.find(
      purchase => purchase.assetId === assetId
    );
    if (purchase) {
      return purchase.maxDownloads - purchase.downloadsUsed;
    }
  }
  
  return 0; // No downloads remaining
};

// Record a download and update the count
export const recordDownload = async (uid: string, assetId: string): Promise<void> => {
  try {
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();
    
    if (fetchError || !userData) {
      throw new Error('User profile not found');
    }
    
    const currentDownloadPurchases = userData.downloadPurchases || [];
    
    // Find the purchase record
    const purchaseIndex = currentDownloadPurchases.findIndex((purchase: PurchaseRecord) => purchase.assetId === assetId);
    if (purchaseIndex === -1) {
      throw new Error('No purchase record found for this asset');
    }
    
    const purchase = currentDownloadPurchases[purchaseIndex];
    if (purchase.downloadsUsed >= purchase.maxDownloads) {
      throw new Error('Maximum downloads exceeded');
    }
    
    // Update download count
    const updatedPurchases = [...currentDownloadPurchases];
    updatedPurchases[purchaseIndex] = {
      ...purchase,
      downloadsUsed: purchase.downloadsUsed + 1
    };
    
    const { error } = await supabase
      .from('users')
      .update({
        downloadPurchases: updatedPurchases
      })
      .eq('uid', uid);
    
    if (error) throw error;
    console.log(`Download recorded. ${purchase.maxDownloads - purchase.downloadsUsed - 1} downloads remaining.`);
  } catch (error) {
    console.error('Error recording download:', error);
    throw error;
  }
};

// Clean exhausted download purchases from user profile
export const cleanExhaustedPurchases = async (uid: string): Promise<void> => {
  try {
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();
    
    if (fetchError || !userData) {
      return;
    }
    
    const currentDownloadPurchases = userData.downloadPurchases || [];
    
    // Keep only purchases with downloads remaining
    const activePurchases = currentDownloadPurchases.filter((purchase: PurchaseRecord) => purchase.downloadsUsed < purchase.maxDownloads);
    
    // Only update if there were exhausted purchases to remove
    if (activePurchases.length !== currentDownloadPurchases.length) {
      const { error } = await supabase
        .from('users')
        .update({
          downloadPurchases: activePurchases
        })
        .eq('uid', uid);
      
      if (error) throw error;
      console.log('Exhausted download purchases cleaned up');
    }
  } catch (error) {
    console.error('Error cleaning exhausted purchases:', error);
  }
};

// Get current user's profile (helper function)
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  return await getUserProfile(user.id);
};

// Update user display name
export const updateDisplayName = async (uid: string, displayName: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ displayName })
      .eq('uid', uid);
    
    if (error) throw error;
    console.log('Display name updated successfully');
  } catch (error) {
    console.error('Error updating display name:', error);
    throw error;
  }
};