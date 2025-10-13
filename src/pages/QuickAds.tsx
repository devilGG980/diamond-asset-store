import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { rewardDiamonds } from '../services/database';
import toast from 'react-hot-toast';
import {
  ArrowTopRightOnSquareIcon,
  GiftIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  FireIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface AdOffer {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  url: string;
  icon: string;
  color: string;
  timeEstimate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Updated: Simplified 3 ads only - v3.0 - 2024-09-25 14:36
const QuickAds: React.FC = () => {
  const { currentUser, userProfile, getUserProfile } = useAuth();
  // Remove ad tracking - make ads unlimited
  const [watchingAd, setWatchingAd] = useState<string | null>(null);
  const [adProgress, setAdProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [totalEarnedToday, setTotalEarnedToday] = useState(0);
  const [adClicked, setAdClicked] = useState(false); // Track if user clicked on the ad

  // Simple ad offers
  const adOffers: AdOffer[] = [
    {
      id: 'watch15',
      title: '📺 Watch Short Ad',
      description: 'Watch a 15-second advertisement and earn diamonds instantly!',
      reward: 10,
      category: 'Video Ad',
      url: '',
      icon: '⏱️',
      color: 'bg-blue-600',
      timeEstimate: '15 sec',
      difficulty: 'Easy'
    },
    {
      id: 'watch30',
      title: '🎬 Watch & Click Ad',
      description: 'Watch a 30-second ad and click on it to earn more diamonds!',
      reward: 20,
      category: 'Interactive Ad',
      url: '',
      icon: '👆',
      color: 'bg-green-600',
      timeEstimate: '30 sec',
      difficulty: 'Easy'
    },
    {
      id: 'youtube',
      title: '🔔 Subscribe YouTube',
      description: 'Subscribe to our YouTube channel for creative content!',
      reward: 5,
      category: 'Subscribe',
      url: 'https://www.youtube.com/@videoforge',
      icon: '📺',
      color: 'bg-red-600',
      timeEstimate: '10 sec',
      difficulty: 'Easy'
    }
  ];

  // Clean up URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reward')) {
      window.history.replaceState({}, '', '/ads');
    }
  }, []);

  const handleAdClick = (offer: AdOffer) => {
    if (watchingAd) {
      toast.error('Please finish watching the current ad first!');
      return;
    }

    // Handle YouTube subscription (external link)
    if (offer.id === 'youtube') {
      toast.success(
        `Opening YouTube channel. Subscribe and return to earn ${offer.reward} diamonds!`,
        { duration: 4000 }
      );
      window.open(offer.url, '_blank');
      
      // Auto-reward after 10 seconds (assuming they subscribed)
      setTimeout(async () => {
        try {
          await rewardDiamonds(currentUser!.id, offer.reward);
          await getUserProfile();
          setTotalEarnedToday(prev => prev + offer.reward);
          toast.success(`🎉 Earned ${offer.reward} diamonds for subscribing!`);
        } catch (error) {
          toast.error('Failed to process reward. Please try again.');
        }
      }, 10000);
      return;
    }

    // Handle video ads (15s and 30s)
    startWatchingAd(offer);
  };

  const startWatchingAd = (offer: AdOffer) => {
    setWatchingAd(offer.id);
    setAdProgress(0);
    setAdClicked(false); // Reset click state
    
    const duration = offer.id === 'watch15' ? 15 : 30; // seconds
    
    if (offer.id === 'watch30') {
      toast.success(`📺 Starting ${duration}-second ad. You must CLICK on the ad to earn ${offer.reward} diamonds!`);
    } else {
      toast.success(`📺 Starting ${duration}-second ad. Please watch to earn ${offer.reward} diamonds!`);
    }
    
    // Simulate ad progress
    const interval = setInterval(() => {
      setAdProgress(prev => {
        const newProgress = prev + (100 / duration);
        if (newProgress >= 100) {
          clearInterval(interval);
          completeAdWatching(offer);
          return 100;
        }
        return newProgress;
      });
    }, 1000);
  };

  const completeAdWatching = async (offer: AdOffer) => {
    try {
      // For 30s ad, check if user clicked on the ad
      if (offer.id === 'watch30' && !adClicked) {
        toast.error('⚠️ You must click on the ad to earn diamonds!');
        // Don't close the modal, let them try to click
        return;
      }
      
      await rewardDiamonds(currentUser!.id, offer.reward);
      await getUserProfile();
      
      // Track total earned for stats
      setTotalEarnedToday(prev => prev + offer.reward);
      
      toast.success(`🎉 Ad complete! Earned ${offer.reward} diamonds!`);
      
      setTimeout(() => {
        setWatchingAd(null);
        setAdProgress(0);
        setAdClicked(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to process reward. Please try again.');
      setWatchingAd(null);
      setAdProgress(0);
      setAdClicked(false);
    }
  };

  const skipAd = () => {
    setWatchingAd(null);
    setAdProgress(0);
    setAdClicked(false);
    toast.error('Ad skipped - No reward earned');
  };

  const handleAdContainerClick = () => {
    if (watchingAd === 'watch30' && !adClicked) {
      setAdClicked(true);
      toast.success('✅ Ad clicked! You can now earn your reward when time is up!');
    }
  };

  const getTodayStats = () => {
    const totalPossible = '∞'; // Unlimited ads
    const earnedToday = totalEarnedToday;
    
    return { totalPossible, earnedToday };
  };

  const stats = getTodayStats();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to earn diamonds</p>
          <a href="/login" className="btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <FireIcon className="h-12 w-12 text-yellow-400 mr-3" />
            <h1 className="text-5xl font-bold text-gradient">Earn Diamonds - New Version</h1>
            <FireIcon className="h-12 w-12 text-yellow-400 ml-3" />
          </div>
          
          <p className="text-xl text-gray-400 mb-8">
            Watch short ads and complete simple tasks to earn instant diamond rewards! 💎
          </p>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">🎯 How It Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-3xl mb-2">1️⃣</div>
                <p className="font-bold text-blue-200">Click an Offer</p>
                <p className="text-gray-300">Choose any offer below and click "Earn Diamonds"</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">2️⃣</div>
                <p className="font-bold text-blue-200">Complete Task</p>
                <p className="text-gray-300">Follow the instructions on the external website</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">3️⃣</div>
                <p className="font-bold text-blue-200">Return & Get Paid</p>
                <p className="text-gray-300">Come back to this tab and get your diamonds instantly!</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-black">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-2xl font-bold mb-1">
                {userProfile?.diamondBalance?.toLocaleString() || 0}
              </div>
              <div className="text-sm opacity-80">Current Balance</div>
            </div>
            
            <div className="card">
              <div className="text-3xl mb-2 text-green-500">🎉</div>
              <div className="text-2xl font-bold text-white mb-1">{stats.earnedToday}</div>
              <div className="text-sm text-gray-400">Earned Today</div>
            </div>
            
            <div className="card">
              <div className="text-3xl mb-2 text-blue-500">✅</div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalPossible}</div>
              <div className="text-sm text-gray-400">Available Offers</div>
            </div>

            <div className="card">
              <div className="text-3xl mb-2 text-purple-500">🚀</div>
              <div className="text-2xl font-bold text-white mb-1">∞</div>
              <div className="text-sm text-gray-400">Unlimited Earning</div>
            </div>
          </div>
        </motion.div>

        {/* Available Offers with Integrated Ads */}
        <div className="space-y-8">
          {/* Top Banner Ad - Integrated into content flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl mx-auto mb-8"
          >
            <div className="relative group bg-gradient-to-r from-gray-800/90 to-gray-900/80 border border-gray-600/50 rounded-2xl h-24 shadow-lg backdrop-blur-sm hover:border-gray-500/70 transition-all duration-300">
              <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Top banner active"></div>
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-sm font-semibold">Featured Banner • 728 x 96</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Offers Grid with better spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {adOffers.map((offer, index) => {
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="card relative overflow-hidden hover:scale-105 transition-all duration-300"
                >
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      offer.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                      offer.difficulty === 'Medium' ? 'bg-yellow-500 text-black' :
                      'bg-red-500 text-white'
                    }`}>
                      {offer.difficulty}
                    </span>
                  </div>

                  {/* Offer Content */}
                  <div className="text-center mb-6 pt-8">
                    <div className="text-6xl mb-4">{offer.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  {/* Smaller, Better Integrated Ad Container */}
                  <div className="mb-4">
                    <div 
                      id={`ad-container-${offer.id}`}
                      className="relative group bg-gradient-to-br from-gray-700/60 to-gray-800/60 border border-gray-600/40 rounded-xl p-4 text-center min-h-[120px] flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:border-gray-500/50"
                    >
                      {/* Compact status indicator */}
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" title="Ad ready"></div>
                      
                      <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        <div className="text-2xl mb-1">
                          {offer.id === 'watch15' && '⚡'}
                          {offer.id === 'watch30' && '🎯'}
                          {offer.id === 'youtube' && '📺'}
                        </div>
                        <div className="text-xs font-medium text-gray-300 mb-1">
                          {offer.category} Ad Slot
                        </div>
                        <div className="text-xs px-2 py-0.5 bg-gray-600/40 rounded-full inline-block">
                          Ready for Content
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reward Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GiftIcon className="h-5 w-5 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-lg">+{offer.reward} 💎</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-sm">{offer.timeEstimate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm text-gray-400">Category:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${offer.color} text-white`}>
                        {offer.category}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleAdClick(offer)}
                    disabled={watchingAd !== null}
                    className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-all ${
                      watchingAd !== null
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : `${offer.color} hover:opacity-90 text-white transform hover:scale-105`
                    }`}
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    <span>Earn {offer.reward} Diamonds</span>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Mid-Content Banner Ad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full max-w-4xl mx-auto my-12"
          >
            <div className="relative group bg-gradient-to-r from-gray-800/90 to-gray-900/80 border border-gray-600/50 rounded-2xl h-28 shadow-lg backdrop-blur-sm hover:border-gray-500/70 transition-all duration-300">
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="Mid banner active"></div>
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <div className="text-3xl mb-2">🚀</div>
                  <div className="text-sm font-semibold">Content Banner • 728 x 112</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-green-900 to-blue-900 p-6 rounded-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <StarIcon className="h-6 w-6 mr-2" />
            💡 Pro Tips for Maximum Earnings
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-green-300 mb-2">✅ Do's:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Keep this tab open while completing offers</li>
                <li>• Complete the full task as described</li>
                <li>• Use a real email for sign-ups</li>
                <li>• Be patient - some offers take a few minutes</li>
                <li>• Check back daily for new offers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-red-300 mb-2">❌ Don'ts:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Don't close this tab before returning</li>
                <li>• Don't use fake information</li>
                <li>• Don't try to cheat the system</li>
                <li>• Don't complete offers multiple times</li>
                <li>• Don't use VPNs or proxies</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>💎 Diamond Assets Store - Earn diamonds, unlock creativity! 💎</p>
        </div>
      </div>

      {/* Ad Watching Modal */}
      {watchingAd && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-800 p-4 text-center border-b border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">
                {watchingAd === 'watch15' ? 'Watching 15s Ad' : 'Watching 30s Ad'}
              </h3>
              <div className="text-sm text-gray-400">
                Please wait {Math.ceil((100 - adProgress) * (watchingAd === 'watch15' ? 15 : 30) / 100)} more seconds...
              </div>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Ad Container - Main Area */}
              <div className="flex-1 bg-black p-4 flex items-center justify-center min-h-[500px]">
                <div className="w-full max-w-2xl">
                  {/* Enhanced Primary Ad Container */}
                  <div 
                    id="ad-container-watching-main"
                    className={`relative border-2 rounded-2xl p-8 text-center mb-6 transition-all duration-500 backdrop-blur-sm ${
                      watchingAd === 'watch30' 
                        ? (adClicked 
                            ? 'bg-gradient-to-br from-green-900/80 to-green-800/60 border-green-400/60 shadow-lg shadow-green-500/20' 
                            : 'bg-gradient-to-br from-gray-800/80 to-gray-900/60 border-yellow-400/80 cursor-pointer hover:bg-gray-700/80 animate-pulse shadow-lg shadow-yellow-500/20'
                          )
                        : 'bg-gradient-to-br from-gray-800/80 to-gray-900/60 border-blue-400/60 shadow-lg shadow-blue-500/20'
                    }`}
                    style={{ minHeight: '380px' }}
                    onClick={handleAdContainerClick}
                  >
                    {/* Premium Ad Space Indicator */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-400 font-medium">LIVE AD SPACE</span>
                    </div>
                    
                    <div className="text-gray-300 space-y-4">
                      {watchingAd === 'watch30' ? (
                        <>
                          <div className="text-7xl transition-transform duration-300 hover:scale-110">{adClicked ? '✅' : '👆'}</div>
                          <h4 className="text-3xl font-bold text-white">
                            {adClicked ? 'Ad Interaction Complete!' : 'Interactive Ad Zone'}
                          </h4>
                          <p className="text-lg">
                            {adClicked 
                              ? 'Great! Wait for the timer to finish to earn your diamonds.' 
                              : 'Click anywhere in this premium ad space to interact!'}
                          </p>
                          {!adClicked && (
                            <div className="text-yellow-300 text-xl font-bold animate-bounce bg-yellow-900/30 rounded-lg p-3 inline-block">
                              👆 CLICK TO INTERACT 👆
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="text-7xl transition-transform duration-300 hover:scale-110">🎬</div>
                          <h4 className="text-3xl font-bold text-white">Premium Video Ad Space</h4>
                          <p className="text-lg">
                            High-engagement advertisement zone for video content
                          </p>
                          <div className="text-sm bg-blue-900/30 p-4 rounded-lg font-mono max-w-md mx-auto border border-blue-700/50">
                            <div className="text-blue-300 font-semibold mb-1">Container ID:</div>
                            <div className="text-blue-200">"ad-container-watching-main"</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced Secondary Ad Container */}
                  <div 
                    id="ad-container-watching-secondary"
                    className="relative bg-gradient-to-r from-gray-700/80 to-gray-800/80 border border-gray-500/50 rounded-xl p-5 text-center backdrop-blur-sm hover:border-gray-400/60 transition-all duration-300 hover:shadow-md hover:shadow-gray-500/10"
                    style={{ minHeight: '140px' }}
                  >
                    {/* Status indicator */}
                    <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" title="Secondary ad slot"></div>
                    
                    <div className="text-gray-400 hover:text-gray-300 transition-colors space-y-3">
                      <div className="text-3xl transform hover:scale-105 transition-transform duration-300">📺</div>
                      <div className="text-sm font-semibold text-gray-300">Secondary Banner Space</div>
                      <div className="text-xs px-3 py-1 bg-gray-600/40 rounded-full inline-block border border-gray-600/50">
                        "ad-container-watching-secondary" - 728x90 Optimal
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Controls Sidebar */}
              <div className="lg:w-80 bg-gray-900 p-6 border-l border-gray-700">
                {/* Progress Section */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Ad Progress</h4>
                  
                  {/* Circular Progress */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-700"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${adProgress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {Math.round(adProgress)}%
                      </span>
                    </div>
                  </div>

                  {/* Linear Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${adProgress}%` }}
                    />
                  </div>
                </div>

                {/* Reward Info */}
                <div className="mb-8 bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-2">💎 Reward</h4>
                  <div className="text-3xl font-bold text-white">
                    +{adOffers.find(offer => offer.id === watchingAd)?.reward || 0} Diamonds
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {adProgress >= 100 
                      ? (watchingAd === 'watch30' && !adClicked ? 'Click the ad first!' : 'Ready to claim!') 
                      : (watchingAd === 'watch30' 
                          ? (adClicked ? 'Wait for timer...' : 'Click the ad!') 
                          : 'Watch the ad to earn'
                        )
                    }
                  </div>
                  {watchingAd === 'watch30' && (
                    <div className={`text-xs mt-2 p-2 rounded ${
                      adClicked 
                        ? 'bg-green-700 text-green-200' 
                        : 'bg-yellow-700 text-yellow-200 animate-pulse'
                    }`}>
                      {adClicked ? '✅ Ad Clicked!' : '⚠️ Click Required!'}
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="space-y-3">
                  {adProgress >= 100 ? (
                    <div className="w-full py-3 px-6 bg-green-600 text-white rounded-lg text-center font-semibold">
                      ✅ Ad Complete!
                    </div>
                  ) : (
                    <button
                      onClick={skipAd}
                      className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
                    >
                      Skip Ad (No Reward)
                    </button>
                  )}
                  
                  <div className="text-xs text-gray-500 text-center">
                    Ad provided by our sponsors
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAds;