import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparklesIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const [showAd, setShowAd] = useState(true);
  
  const toggleAd = () => {
    setShowAd(!showAd);
  };
  
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden md:block fixed right-0 top-16 w-80 bg-gray-900 border-l-2 border-yellow-400 h-screen overflow-y-auto shadow-2xl z-40"
    >
      <div className="p-6 space-y-6">
        {/* Ad Status - No Ads Active */}
        <div className="card relative">
          <div className="flex items-center mb-3">
            <div className="flex items-center space-x-2">
              <span className="inline-block h-2 w-2 rounded-full bg-gray-500" />
              <span className="text-xs font-medium text-gray-400">No Ads Active</span>
            </div>
          </div>
          <div className="w-full h-[250px] bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-500 text-lg mb-2">⚫</div>
              <div className="text-gray-400 text-sm mb-1">Advertisement Space</div>
              <div className="text-gray-500 text-xs">No active ad networks</div>
            </div>
          </div>
        </div>
        
        {/* Featured Assets */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">🔥 Trending Assets</h3>
          <div className="space-y-3">
            {[
              { name: 'Pro Transition Pack 1', price: 150, image: '🎬', category: 'Transitions' },
              { name: 'Pro Transition Pack 2', price: 125, image: '✨', category: 'Transitions' },
              { name: 'Pro Transition Pack 3', price: 200, image: '🎭', category: 'Transitions' },
            ].map((asset, index) => (
              <motion.div
                key={asset.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="text-2xl">{asset.image}</div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium line-clamp-1">{asset.name}</p>
                  <p className="text-yellow-400 text-xs">💎 {asset.price}</p>
                  <p className="text-gray-500 text-xs">{asset.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Earn Diamonds CTA */}
        <div className="card bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-3"
            >
              💎
            </motion.div>
            <h3 className="text-lg font-bold text-white mb-2">
              Earn Free Diamonds!
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Watch short ads and earn diamonds to unlock premium assets
            </p>
            <Link to="/ads" className="btn-primary w-full block text-center">
              Start Earning
            </Link>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">📊 Platform Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Assets</span>
              <span className="text-yellow-400 font-medium">3 Available</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Categories</span>
              <span className="text-yellow-400 font-medium">9 Types</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Users</span>
              <span className="text-yellow-400 font-medium">Growing...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Downloads</span>
              <span className="text-yellow-400 font-medium">Coming soon</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">⚡ Quick Actions</h3>
          <div className="space-y-2">
            <Link 
              to="/store"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors flex items-center space-x-2"
              title="Browse Free Video Editing Assets"
            >
              <span>🛒</span>
              <span>Browse Store</span>
            </Link>
            <Link 
              to="/blog"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors flex items-center space-x-2"
              title="Video Editing Tips and Tutorials"
            >
              <span>📚</span>
              <span>Learn & Tips</span>
            </Link>
            <Link 
              to="/about"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors flex items-center space-x-2"
              title="About Video Forge"
            >
              <span>ℹ️</span>
              <span>About Us</span>
            </Link>
          </div>
        </div>
        
        {/* Categories Navigation */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">🎯 Asset Categories</h3>
          <div className="space-y-2">
            {[
              { name: 'Video Transitions', category: 'Transitions', icon: '🎬' },
              { name: 'Music Tracks', category: 'Music', icon: '🎵' },
              { name: 'Backgrounds', category: 'Backgrounds', icon: '🖼️' },
              { name: 'Animations', category: 'Animations', icon: '✨' }
            ].map((cat) => (
              <Link 
                key={cat.category}
                to={`/store?category=${encodeURIComponent(cat.category)}`}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
                title={`Free ${cat.name} for Video Editing`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">🌐 Connect</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Discord', icon: '💬', color: 'bg-indigo-600' },
              { name: 'YouTube', icon: '📺', color: 'bg-red-600' },
              { name: 'Twitter', icon: '🐦', color: 'bg-blue-500' },
              { name: 'GitHub', icon: '💻', color: 'bg-gray-600' },
            ].map((social) => (
              <button
                key={social.name}
                className={`${social.color} text-white p-2 rounded-lg text-sm hover:opacity-80 transition-opacity flex items-center justify-center space-x-1`}
              >
                <span>{social.icon}</span>
                <span>{social.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-4">ℹ️ About</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p><strong>Video Forge</strong> - Professional video editing assets marketplace</p>
            <p>Powered by <span className="text-yellow-400">Diamond Currency</span></p>
            <p className="text-xs text-gray-500">v1.0.0 - Built with React & Firebase</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;