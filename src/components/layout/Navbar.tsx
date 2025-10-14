import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import DiamondBalance from '../ui/DiamondBalance';
import {
  HomeIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  PlayIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  InformationCircleIcon,
  PhoneIcon,
  BookOpenIcon,
  PencilSquareIcon,

} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Store', path: '/store', icon: ShoppingBagIcon },
    { name: 'Editor', path: '/editor', icon: PencilSquareIcon },
    { name: 'Blog', path: '/blog', icon: BookOpenIcon },

    { name: 'About', path: '/about', icon: InformationCircleIcon },
    { name: 'Contact', path: '/contact', icon: PhoneIcon },
    ...(currentUser ? [
      { name: 'Earn Diamonds', path: '/ads', icon: PlayIcon },
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg"
            >
              {/* Camera Aperture Icon */}
              <div className="relative w-6 h-6">
                {/* Outer ring */}
                <div className="absolute inset-0 border-2 border-white rounded-full"></div>
                {/* Inner aperture blades */}
                <div className="absolute inset-1 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-white opacity-30"></div>
                  {/* Aperture segments */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-0.5 bg-white top-1/2 left-0 origin-left transform -translate-y-0.5"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${i * 22.5}deg) translate(50%, -50%)`
                      }}
                    />
                  ))}
                </div>
                {/* Center dollar sign for download/purchase */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-0.5">
                    <div className="w-full h-0.5 bg-white opacity-60"></div>
                    <div className="absolute inset-0 transform rotate-90">
                      <div className="w-full h-0.5 bg-white opacity-60"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient leading-tight">Video Forge</span>
              <span className="text-xs text-gray-400 leading-none">Asset Market</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Diamond Balance */}
            {currentUser && <DiamondBalance />}
            
            {currentUser && userProfile && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {userProfile.displayName}
                  </p>
                </div>
              </div>
            )}

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="btn-secondary"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          {/* Mobile Diamond Balance */}
          {currentUser && (
            <div className="mb-4 px-4">
              <DiamondBalance />
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;