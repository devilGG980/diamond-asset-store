import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { rewardDiamonds } from '../services/database';
import toast from 'react-hot-toast';
import {
  PlayIcon,
  ClockIcon,
  GiftIcon,
  CheckCircleIcon,
  TvIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface AdSlot {
  id: number;
  title: string;
  description: string;
  reward: number;
  duration: number; // in seconds
  category: string;
  available: boolean;
  cooldown?: number; // minutes until next view
}

const AdsPage: React.FC = () => {
  const { currentUser, userProfile, getUserProfile, loading } = useAuth();
  const [watchingAd, setWatchingAd] = useState<number | null>(null);
  const [adProgress, setAdProgress] = useState(0);
  const [earnedToday, setEarnedToday] = useState(0);
  const [watchedCount, setWatchedCount] = useState(0);

  const [adSlots] = useState<AdSlot[]>([
    {
      id: 1,
      title: 'Quick Reward Ad',
      description: 'Watch a short 15-second video and earn instant diamonds',
      reward: 25,
      duration: 15,
      category: 'Quick',
      available: true,
    },
    {
      id: 2,
      title: 'Premium Sponsor',
      description: 'Extended ad from our premium sponsors - Higher rewards!',
      reward: 75,
      duration: 30,
      category: 'Premium',
      available: true,
    },
    {
      id: 3,
      title: 'Gaming Ad Break',
      description: 'Gaming-focused advertisements with bonus rewards',
      reward: 50,
      duration: 20,
      category: 'Gaming',
      available: true,
    },
    {
      id: 4,
      title: 'Creative Tools Showcase',
      description: 'Discover new creative tools and software',
      reward: 60,
      duration: 25,
      category: 'Creative',
      available: true,
    },
    {
      id: 5,
      title: 'Daily Bonus Ad',
      description: 'Special daily bonus - Limited availability!',
      reward: 100,
      duration: 45,
      category: 'Bonus',
      available: watchedCount < 3, // Only available for first 3 views
    },
  ]);

  const watchAd = async (adSlot: AdSlot) => {
    if (!adSlot.available) return;

    setWatchingAd(adSlot.id);
    setAdProgress(0);

    // Simulate ad watching progress
    const interval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeAd(adSlot);
          return 100;
        }
        return prev + (100 / adSlot.duration);
      });
    }, 1000);
  };

  const completeAd = async (adSlot: AdSlot) => {
    if (!currentUser) {
      toast.error('Please sign in to earn rewards');
      return;
    }

    try {
      // Use Realtime Database rewardDiamonds function
      await rewardDiamonds(currentUser.uid, adSlot.reward);
      await getUserProfile();
      
      setEarnedToday(prev => prev + adSlot.reward);
      setWatchedCount(prev => prev + 1);
      
      toast.success(`🎉 Earned ${adSlot.reward} diamonds! Total today: ${earnedToday + adSlot.reward}`);
      
      setTimeout(() => {
        setWatchingAd(null);
        setAdProgress(0);
      }, 2000);
    } catch (error: any) {
      console.error('Failed to reward diamonds:', error);
      if (error.message === 'Daily ad limit reached') {
        toast.error('📺 Daily ad limit reached! Come back tomorrow.');
      } else {
        toast.error('Failed to process reward. Please try again.');
      }
      setWatchingAd(null);
      setAdProgress(0);
    }
  };

  const skipAd = () => {
    setWatchingAd(null);
    setAdProgress(0);
    toast.error('Ad skipped - No reward earned');
  };

  const getTodayStats = () => {
    const maxDaily = 500; // Maximum diamonds per day
    const percentage = Math.min((earnedToday / maxDaily) * 100, 100);
    return { maxDaily, percentage, remaining: Math.max(maxDaily - earnedToday, 0) };
  };

  const stats = getTodayStats();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Earn Diamonds...</h2>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if no user
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gradient mb-4">Earn Diamonds</h1>
          <p className="text-xl text-gray-400 mb-8">
            Watch short advertisements and earn free diamonds! 💎
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-black">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-2xl font-bold mb-1">
                {userProfile ? userProfile.diamondBalance.toLocaleString() : (
                  <span className="animate-pulse">Loading...</span>
                )}
              </div>
              <div className="text-sm opacity-80">Current Balance</div>
            </div>
            
            <div className="card">
              <div className="text-3xl mb-2 text-green-500">📈</div>
              <div className="text-2xl font-bold text-white mb-1">{earnedToday}</div>
              <div className="text-sm text-gray-400">Earned Today</div>
            </div>
            
            <div className="card">
              <div className="text-3xl mb-2 text-blue-500">🎬</div>
              <div className="text-2xl font-bold text-white mb-1">{watchedCount}</div>
              <div className="text-sm text-gray-400">Ads Watched</div>
            </div>
          </div>

          {/* Daily Progress */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Daily Progress</h3>
              <span className="text-yellow-400">{stats.remaining} diamonds remaining</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>0</span>
              <span>{earnedToday} / {stats.maxDaily} diamonds</span>
              <span>{stats.maxDaily}</span>
            </div>
          </div>
        </motion.div>

        {/* Ad Watching Modal */}
        <AnimatePresence>
          {watchingAd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-900 rounded-xl p-8 max-w-md w-full text-center"
              >
                <div className="text-6xl mb-6">📺</div>
                <h3 className="text-2xl font-bold text-white mb-4">Watching Advertisement</h3>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${adProgress}%` }}
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-1000"
                  />
                </div>
                
                <p className="text-gray-400 mb-6">
                  {adProgress < 100 ? 'Please wait for the ad to complete...' : 'Ad completed! Processing reward...'}
                </p>

                {adProgress < 100 && (
                  <button
                    onClick={skipAd}
                    className="btn-secondary"
                  >
                    Skip Ad (No Reward)
                  </button>
                )}

                {adProgress >= 100 && (
                  <div className="flex items-center justify-center text-green-500">
                    <CheckCircleIcon className="h-6 w-6 mr-2" />
                    <span>Reward Processing...</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Available Ads */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adSlots.map((adSlot, index) => (
            <motion.div
              key={adSlot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card relative overflow-hidden ${
                !adSlot.available ? 'opacity-50' : 'hover:scale-105'
              } transition-all duration-300`}
            >
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  adSlot.category === 'Premium' ? 'bg-purple-500 text-white' :
                  adSlot.category === 'Bonus' ? 'bg-yellow-500 text-black' :
                  adSlot.category === 'Gaming' ? 'bg-blue-500 text-white' :
                  adSlot.category === 'Creative' ? 'bg-green-500 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {adSlot.category}
                </span>
              </div>

              {/* Ad Content */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">
                  {adSlot.category === 'Premium' ? '⭐' :
                   adSlot.category === 'Bonus' ? '🎁' :
                   adSlot.category === 'Gaming' ? '🎮' :
                   adSlot.category === 'Creative' ? '🎨' : '📺'}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{adSlot.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{adSlot.description}</p>
              </div>

              {/* Reward Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <GiftIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">+{adSlot.reward} 💎</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <ClockIcon className="h-4 w-4" />
                  <span className="text-sm">{adSlot.duration}s</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => watchAd(adSlot)}
                disabled={!adSlot.available || watchingAd !== null}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-all ${
                  adSlot.available && watchingAd === null
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {watchingAd === adSlot.id ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Watching...</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-5 w-5" />
                    <span>{adSlot.available ? 'Watch Ad' : 'Not Available'}</span>
                  </>
                )}
              </button>

              {!adSlot.available && adSlot.category === 'Bonus' && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Daily limit reached
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid md:grid-cols-2 gap-8"
        >
          {/* How it Works */}
          <div className="card">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TvIcon className="h-6 w-6 mr-2" />
              How It Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="text-white font-medium">Choose an Ad</p>
                  <p className="text-gray-400 text-sm">Select from available advertisement slots</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="text-white font-medium">Watch Complete Ad</p>
                  <p className="text-gray-400 text-sm">Stay engaged throughout the entire duration</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="text-white font-medium">Earn Diamonds</p>
                  <p className="text-gray-400 text-sm">Receive instant rewards to your account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips & Guidelines */}
          <div className="card">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <StarIcon className="h-6 w-6 mr-2" />
              Tips & Guidelines
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                <span>Watch ads completely to earn full rewards</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                <span>Daily limit: 500 diamonds maximum</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                <span>Premium ads offer higher reward rates</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                <span>Bonus ads have limited daily availability</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <ChartBarIcon className="h-4 w-4 flex-shrink-0" />
                <span>Track your progress with the daily meter</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdsPage;