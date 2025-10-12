import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  PlayIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface AdType {
  id: string;
  name: string;
  duration: number;
  reward: number;
  icon: string;
  color: string;
}

const FastAdsPage: React.FC = () => {
  const { currentUser, updateUserDiamonds } = useAuth();
  const [showAdModal, setShowAdModal] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAd, setCurrentAd] = useState<AdType | null>(null);
  const [dailyEarned, setDailyEarned] = useState(0);
  const [totalWatched, setTotalWatched] = useState(0);
  const [adInterval, setAdInterval] = useState<NodeJS.Timeout | null>(null);
  const [rewardGiven, setRewardGiven] = useState(false);

  const adTypes: AdType[] = [
    {
      id: 'quick',
      name: 'Quick Ad',
      duration: 15,
      reward: 10,
      icon: '⚡',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'long',
      name: 'Long Ad',
      duration: 30,
      reward: 25,
      icon: '💰',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const openAdModal = () => {
    // Check if user is logged in first
    if (!currentUser) {
      toast.error('Please log in to watch ads and earn diamonds!');
      return;
    }
    
    console.log('Opening ad modal...');
    setShowAdModal(true);
    console.log('showAdModal state:', true);
  };

  const closeAdModal = () => {
    // Clear any running intervals
    if (adInterval) {
      clearInterval(adInterval);
      setAdInterval(null);
    }
    
    // Show warning if ad was interrupted
    if (isWatching && !rewardGiven) {
      toast.error('Ad interrupted - No reward earned');
    }
    
    // Reset all states
    setShowAdModal(false);
    setIsWatching(false);
    setProgress(0);
    setCurrentAd(null);
    setRewardGiven(false);
  };

  const selectAd = (ad: AdType) => {
    setCurrentAd(ad);
    setIsWatching(true);
    setProgress(0);
    setRewardGiven(false);

    // Simulate ad watching progress with secure interval tracking
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / ad.duration);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setAdInterval(null);
          setRewardGiven(true);
          completeAd(ad);
          return 100;
        }
        
        return newProgress;
      });
    }, 1000);
    
    // Store interval reference for cleanup
    setAdInterval(interval);
  };

  const completeAd = async (ad: AdType) => {
    try {
      // Check if user is logged in
      if (!currentUser) {
        toast.error('Please log in to earn diamonds');
        return;
      }
      
      // Update real diamond balance in database
      await updateUserDiamonds(ad.reward);
      
      // Update local stats for display
      setDailyEarned(prev => prev + ad.reward);
      setTotalWatched(prev => prev + 1);
      
      toast.success(`🎉 Earned ${ad.reward} diamonds! Check your balance!`);
      
      setTimeout(() => {
        // Clean close after reward
        setShowAdModal(false);
        setIsWatching(false);
        setProgress(0);
        setCurrentAd(null);
        setRewardGiven(false);
      }, 2000);
    } catch (error: any) {
      console.error('Failed to reward diamonds:', error);
      toast.error('Failed to update diamonds. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 relative safe-area-top">
      {/* Header Banner Ad */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group bg-gradient-to-r from-gray-800/90 to-gray-900/80 border border-gray-600/50 rounded-2xl h-24 shadow-xl backdrop-blur-sm hover:border-gray-500/70 transition-all duration-500"
        >
          <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Header ad active"></div>
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-300">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-sm font-semibold">Header Banner • 728 x 90</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-2">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 mt-4 sm:mt-8"
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-gradient mb-3 sm:mb-4">📺 Earn Diamonds</h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8 px-2">
            Choose your ad and earn diamonds!
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card text-center">
            <div className="text-3xl sm:text-4xl mb-2 text-green-500">📈</div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">{dailyEarned}</div>
            <div className="text-xs sm:text-sm text-gray-400">Diamonds Earned Today</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl sm:text-4xl mb-2 text-blue-500">🎼</div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">{totalWatched}</div>
            <div className="text-xs sm:text-sm text-gray-400">Total Ads Watched</div>
          </div>
        </div>

        {/* Main Content Area with Sidebar Ads */}
        <div className="flex justify-center items-start gap-6 max-w-7xl mx-auto">
          {/* Left Sidebar Ad Container */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <div className="relative group bg-gradient-to-br from-gray-800/90 to-gray-900/80 border border-gray-600/50 rounded-2xl h-96 shadow-xl backdrop-blur-sm hover:border-gray-500/70 transition-all duration-500">
                <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Left sidebar ad active"></div>
                <div className="h-full flex items-center justify-center p-4">
                  <div className="text-center text-gray-400 group-hover:text-gray-300 transition-colors">
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">🎯</div>
                    <div className="text-sm font-semibold mb-2 text-gray-300">Sidebar Premium</div>
                    <div className="text-xs px-2 py-1 bg-gray-700/50 rounded-full border border-gray-600/50">250 x 384</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-md">
            {/* Main Watch Ads Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center"
            >
              <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">📺</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Watch Advertisements</h2>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-2">
                {currentUser 
                  ? 'Choose between a quick 15s ad or a longer 30s ad for more rewards!'
                  : 'Please log in to watch ads and earn diamonds!'}
              </p>
              
              <button
                onClick={openAdModal}
                className={`w-full py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center space-x-2 hover:scale-105 transition-transform touch-target ${
                  currentUser ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <PlayIcon className="h-5 sm:h-6 w-5 sm:w-6" />
                <span>{currentUser ? 'Watch Ads' : 'Login to Watch Ads'}</span>
              </button>
            </motion.div>
          </div>

          {/* Right Sidebar Ad Container */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-24"
            >
              <div className="relative group bg-gradient-to-bl from-gray-800/90 to-gray-900/80 border border-gray-600/50 rounded-2xl h-96 shadow-xl backdrop-blur-sm hover:border-gray-500/70 transition-all duration-500">
                <div className="absolute top-3 left-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="Right sidebar ad active"></div>
                <div className="h-full flex items-center justify-center p-4">
                  <div className="text-center text-gray-400 group-hover:text-gray-300 transition-colors">
                    <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">🚀</div>
                    <div className="text-sm font-semibold mb-2 text-gray-300">Sidebar Featured</div>
                    <div className="text-xs px-2 py-1 bg-gray-700/50 rounded-full border border-gray-600/50">250 x 384</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Integrated Content Ad Containers */}
        <div className="mt-12 space-y-12 pb-16">
          {/* Footer Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="w-full max-w-4xl mx-auto mt-12"
          >
            <div className="relative group bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-600/50 rounded-2xl h-32 shadow-xl backdrop-blur-sm hover:border-gray-500/70 transition-all duration-300">
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full animate-pulse" title="Footer ad active"></div>
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-sm font-semibold">Footer Banner • 728 x 128</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ad Selection Modal */}
        {showAdModal && (
          <div 
            className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center"
            style={{ 
              zIndex: 99999, 
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              position: 'fixed',
              inset: '0px'
            }}
          >
            {/* Large Left Side Ad Container */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="fixed left-4 top-1/2 transform -translate-y-1/2 hidden xl:block"
            >
              <div className="bg-gray-100 border-4 border-gray-300 rounded-2xl w-80 h-96 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">📺</div>
                    <div className="text-lg font-bold mb-2">Premium Ad Space</div>
                    <div className="text-sm opacity-70 mb-4">320 x 384</div>
                    <div className="bg-gray-200 p-3 rounded-lg text-xs">
                      High-visibility ad placement
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Large Right Side Ad Container */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="fixed right-4 top-1/2 transform -translate-y-1/2 hidden xl:block"
            >
              <div className="bg-gray-100 border-4 border-gray-300 rounded-2xl w-80 h-96 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">🎬</div>
                    <div className="text-lg font-bold mb-2">Featured Ad Zone</div>
                    <div className="text-sm opacity-70 mb-4">320 x 384</div>
                    <div className="bg-gray-200 p-3 rounded-lg text-xs">
                      Prime advertising real estate
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>



            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white text-black rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-4 border-gray-200"
              style={{ maxHeight: '90vh', overflow: 'auto' }}
            >
                {/* Close Button */}
                <button
                  onClick={closeAdModal}
                  className="absolute top-6 right-6 text-gray-600 hover:text-black transition-colors text-3xl font-bold z-10 bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ×
                </button>

                {/* Top Mini Banner */}
                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg h-16 mb-6 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-sm font-medium">Header Ad • 468 x 60</div>
                  </div>
                </div>

                {!isWatching ? (
                  <>
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-black mb-4">Choose Your Ad</h3>
                      <p className="text-gray-600">Select the ad duration and earn diamonds!</p>
                    </div>

                    {/* Ad Options - Moved to Top */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      {adTypes.map((ad) => (
                        <button
                          key={ad.id}
                          onClick={() => selectAd(ad)}
                          className={`p-6 rounded-xl bg-gradient-to-r ${ad.color} text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-300`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-4xl">{ad.icon}</div>
                              <div className="text-left">
                                <h4 className="text-xl font-bold">{ad.name}</h4>
                                <div className="flex items-center space-x-2 text-sm opacity-90">
                                  <ClockIcon className="h-4 w-4" />
                                  <span>{ad.duration} seconds</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">+{ad.reward}</div>
                              <div className="text-sm opacity-90">💎 diamonds</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Featured Advertisement - Moved to Middle */}
                    <div className="mb-6">
                      <div className="bg-gray-100 border-4 border-gray-300 rounded-xl h-32 flex items-center justify-center shadow-md">
                        <div className="text-center text-gray-600">
                          <div className="text-3xl mb-2">📺</div>
                          <div className="text-sm font-bold mb-1">Featured Advertisement</div>
                          <div className="text-xs opacity-60">600 x 128</div>
                        </div>
                      </div>
                    </div>

                    {/* Premium and Sponsored - Moved to Bottom */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-100 border-2 border-gray-300 rounded-lg h-24 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <div className="text-sm font-medium mb-1">🏆 Premium</div>
                          <div className="text-xs opacity-60">300 x 96</div>
                        </div>
                      </div>
                      <div className="bg-gray-100 border-2 border-gray-300 rounded-lg h-24 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <div className="text-sm font-medium mb-1">🚀 Sponsored</div>
                          <div className="text-xs opacity-60">300 x 96</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Footer Ad */}
                    <div className="bg-gray-100 border-2 border-gray-300 rounded-lg h-16 mt-6 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-sm font-medium">Footer Ad • 600 x 64</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Watching Ad - Enhanced */}
                    <div className="text-center">
                      {/* Large Ad Container for Watching */}
                      <div className="bg-gray-100 border-4 border-gray-300 rounded-2xl h-40 mb-6 flex items-center justify-center shadow-lg">
                        <div className="text-center text-gray-600">
                          <div className="text-6xl mb-2">{currentAd?.icon}</div>
                          <div className="text-lg font-bold">Live Advertisement</div>
                          <div className="text-sm opacity-70">Interactive Ad Experience</div>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-black mb-2">Watching {currentAd?.name}</h3>
                      <p className="text-gray-600 mb-8">Earning {currentAd?.reward} diamonds...</p>
                      
                      {/* Circular Progress */}
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-700"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="3"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-green-500"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="3"
                            strokeDasharray={`${progress}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-black">{Math.round(progress)}%</div>
                            <div className="text-xs text-gray-600">{Math.ceil((currentAd?.duration || 15) * (100 - progress) / 100)}s</div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600">
                        {progress < 100 ? 'Please wait for the ad to complete...' : 'Processing reward...'}
                      </p>
                      
                      {progress >= 100 && (
                        <div className="flex items-center justify-center mt-4 text-green-600">
                          <CheckCircleIcon className="h-6 w-6 mr-2" />
                          <span>Reward Processing...</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
            </motion.div>
          </div>
        )}

        {/* Simple note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ✨ Choose your preferred ad length and start earning!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FastAdsPage;