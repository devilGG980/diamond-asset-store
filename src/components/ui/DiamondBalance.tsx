import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

const DiamondBalance: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  
  // Show loading state if profile is still loading
  const diamondBalance = userProfile?.diamondBalance ?? 0;
  const isLoading = !userProfile;

  // Don't show if user is not logged in
  if (!currentUser) {
    console.log('DiamondBalance - No current user, hiding component');
    return null;
  }

  return (
    <>
      {/* Desktop Diamond Balance */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-20 right-4 z-40 md:block hidden"
      >
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full shadow-2xl border-2 border-yellow-400">
        <div className="flex items-center space-x-3">
          {/* Animated Diamond Icon */}
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
            className="text-2xl"
          >
            💎
          </motion.div>
          
          {/* Balance Display */}
          <div className="flex items-center space-x-2">
            <motion.span
              key={diamondBalance} // Re-animate when balance changes
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold"
            >
              {isLoading ? (
                <span className="animate-pulse text-sm">Loading...</span>
              ) : (
                diamondBalance.toLocaleString()
              )}
            </motion.span>
            
            {/* Earn More Button */}
            <Link
              to="/ads"
              className="ml-2 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-all duration-200 hover:scale-110"
              title="Earn more diamonds"
            >
              <PlusIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Floating Label */}
        <div className="text-xs font-medium text-center mt-1 opacity-80">
          Diamonds
        </div>
      </div>
      
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full blur-lg opacity-30 -z-10 scale-110"></div>
      </motion.div>
      
      {/* Mobile Diamond Balance */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-16 left-0 right-0 z-40 md:hidden"
      >
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 mx-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-lg"
              >
                💎
              </motion.span>
              <motion.span
                key={diamondBalance}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="font-bold text-lg"
              >
                {isLoading ? (
                  <span className="animate-pulse text-sm">Loading...</span>
                ) : (
                  diamondBalance.toLocaleString()
                )}
              </motion.span>
              <span className="text-sm opacity-80">Diamonds</span>
            </div>
            
            <Link
              to="/ads"
              className="bg-black bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200"
            >
              Earn +
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DiamondBalance;