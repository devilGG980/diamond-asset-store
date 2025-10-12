import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { mockAssets, Asset } from '../data/assets';
import { rewardDiamonds } from '../services/database';
import {
  UserIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  EyeIcon,
  ChartBarIcon,
  GiftIcon,
  PlayIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { currentUser, userProfile, getUserProfile } = useAuth();
  const [purchasedAssets, setPurchasedAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    totalDownloads: 0,
    joinedDate: new Date()
  });

  useEffect(() => {
    if (userProfile) {
      // Get purchased assets
      const purchased = mockAssets.filter(asset => 
        userProfile.purchasedAssets?.includes(asset.id.toString())
      );
      setPurchasedAssets(purchased);

      // Calculate stats
      const totalSpent = purchased.reduce((sum, asset) => sum + asset.price, 0);
      const totalDownloads = purchased.reduce((sum, asset) => sum + asset.downloads, 0);
      
      setStats({
        totalPurchases: purchased.length,
        totalSpent,
        totalDownloads,
        joinedDate: new Date(userProfile.createdAt)
      });
    }
  }, [userProfile]);

  const handleDownload = (asset: Asset) => {
    toast.success(`Downloading ${asset.title}...`);
    
    // Simulate download
    const link = document.createElement('a');
    link.href = asset.downloadUrl;
    link.download = asset.title.replace(/\s+/g, '-').toLowerCase();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show loading spinner while auth is loading
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading while user profile is being fetched
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400 mb-4">Loading your profile...</p>
          <p className="text-sm text-gray-500">
            If this takes too long, make sure Firebase Authentication and Realtime Database are enabled.
          </p>
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
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-gradient mb-4">Dashboard</h1>
          <p className="text-xl text-gray-400">
            Welcome back, {userProfile.displayName}! 👋
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Diamond Balance */}
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-black">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💎</div>
              <CurrencyDollarIcon className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold mb-2">{userProfile.diamondBalance}</div>
            <div className="text-sm opacity-80">Diamond Balance</div>
            <Link to="/ads" className="mt-4 bg-black text-yellow-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors block text-center">
              Earn More
            </Link>
          </div>

          {/* Total Purchases */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🛍️</div>
              <ChartBarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.totalPurchases}</div>
            <div className="text-sm text-gray-400">Assets Owned</div>
          </div>

          {/* Total Spent */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💸</div>
              <CurrencyDollarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.totalSpent}</div>
            <div className="text-sm text-gray-400">Diamonds Spent</div>
          </div>

          {/* Member Since */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📅</div>
              <CalendarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-lg font-bold text-white mb-2">
              {stats.joinedDate instanceof Date ? 
                stats.joinedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) :
                'Recently'
              }
            </div>
            <div className="text-sm text-gray-400">Member Since</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <UserIcon className="h-6 w-6 mr-2" />
                Profile
              </h2>

              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-400 rounded-full flex items-center justify-center text-4xl font-bold text-black mx-auto mb-4">
                  {userProfile.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className="text-xl font-bold text-white">{userProfile.displayName}</h3>
                <p className="text-gray-400">{userProfile.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Account Type</span>
                  <span className="text-white font-medium">Premium User</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Total Assets</span>
                  <span className="text-white font-medium">{stats.totalPurchases}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white font-medium">
                    {new Date(userProfile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link to="/ads" className="w-full btn-primary flex items-center justify-center">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Watch Ads
                </Link>
                <Link to="/store" className="w-full btn-secondary flex items-center justify-center">
                  <EyeIcon className="h-5 w-5 mr-2" />
                  Browse Store
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Purchased Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <DocumentArrowDownIcon className="h-6 w-6 mr-2" />
                  My Assets ({purchasedAssets.length})
                </h2>
                {purchasedAssets.length > 0 && (
                  <button 
                    onClick={() => {
                      purchasedAssets.forEach(asset => handleDownload(asset));
                      toast.success('Downloading all assets...');
                    }}
                    className="btn-secondary text-sm"
                  >
                    Download All
                  </button>
                )}
              </div>

              {purchasedAssets.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {purchasedAssets.map((asset, index) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-3xl">{asset.thumbnail}</div>
                      
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{asset.title}</h3>
                        <p className="text-gray-400 text-sm">
                          {asset.category} • {asset.fileSize}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-yellow-400 text-sm">💎 {asset.price}</span>
                          <span className="text-gray-500 text-sm">
                            {asset.downloads.toLocaleString()} downloads
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/asset/${asset.id}`}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDownload(asset)}
                          className="btn-primary text-sm"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎁</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Assets Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start building your collection by browsing our premium assets.
                  </p>
                  <Link to="/store" className="btn-primary">
                    Browse Store
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="card bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Need More Diamonds? 💎
                </h3>
                <p className="text-gray-300">
                  Watch short ads to earn free diamonds and unlock more premium assets.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <Link to="/ads" className="btn-primary">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Watch Ads
                </Link>
                <button className="btn-secondary" disabled>
                  Buy Diamonds (Soon)
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            
            <div className="space-y-3">
              {purchasedAssets.slice(0, 3).map((asset, index) => (
                <div key={asset.id} className="flex items-center space-x-3 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Purchased <span className="text-white">{asset.title}</span></span>
                  <span className="text-gray-600">•</span>
                  <span>{asset.createdAt.toLocaleDateString()}</span>
                </div>
              ))}
              
              {purchasedAssets.length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;