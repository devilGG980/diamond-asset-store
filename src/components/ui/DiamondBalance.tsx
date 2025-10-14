import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

const DiamondBalance: React.FC = () => {
  const { currentUser, userProfile, getUserProfile, loading } = useAuth();
  
  // Show loading state if profile is still loading
  const diamondBalance = userProfile?.diamondBalance ?? 0;
  const isProfileLoading = !userProfile && !!currentUser;

  // If we have a user but no profile, try to fetch it
  useEffect(() => {
    if (currentUser && !userProfile) {
      console.log('DiamondBalance - Fetching user profile');
      getUserProfile();
    }
  }, [currentUser, userProfile, getUserProfile]);

  // Don't show if user is not logged in
  if (!currentUser) {
    console.log('DiamondBalance - No current user, hiding component');
    return null;
  }

  console.log('DiamondBalance - currentUser:', currentUser);
  console.log('DiamondBalance - userProfile:', userProfile);
  console.log('DiamondBalance - context loading:', loading);
  console.log('DiamondBalance - isProfileLoading:', isProfileLoading);

  return (
    <>
      {/* Desktop Diamond Balance - Positioned in the navbar */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to="/ads"
          className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-lg"
          >
            💎
          </motion.div>
          <motion.span
            key={diamondBalance} // Re-animate when balance changes
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="font-bold text-lg"
          >
            {isProfileLoading || loading ? (
              <span className="animate-pulse text-sm">...</span>
            ) : (
              diamondBalance.toLocaleString()
            )}
          </motion.span>
          <span className="text-sm font-medium hidden sm:inline">Diamonds</span>
        </Link>
      </div>
      
      {/* Mobile Diamond Balance - This will be shown in the mobile navigation section */}
      <div className="md:hidden flex items-center justify-center py-2">
        <Link
          to="/ads"
          className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg w-full justify-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-lg"
          >
            💎
          </motion.div>
          <motion.span
            key={diamondBalance} // Re-animate when balance changes
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="font-bold"
          >
            {isProfileLoading || loading ? (
              <span className="animate-pulse text-sm">...</span>
            ) : (
              diamondBalance.toLocaleString()
            )}
          </motion.span>
          <span className="text-sm font-medium">Diamonds</span>
        </Link>
      </div>
    </>
  );
};

export default DiamondBalance;