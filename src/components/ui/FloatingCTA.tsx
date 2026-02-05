import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

const FloatingCTA: React.FC = () => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showFloating, setShowFloating] = useState(false);

  // Show floating button after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowFloating(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if ((e as any).clientY <= 0 && !isHidden && !showExitIntent) {
        setShowExitIntent(true);
        // Auto-hide after 8 seconds
        setTimeout(() => setShowExitIntent(false), 8000);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isHidden, showExitIntent]);

  if (isHidden) return null;

  return (
    <>
      {/* Exit Intent Modal */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 p-4"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900 to-black border-2 border-purple-500 rounded-2xl p-8 max-w-md text-center shadow-2xl"
            >
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold text-white mb-2">Wait! Free Assets Inside 👀</h3>
              <p className="text-gray-300 mb-6">
                Get access to 500+ free video editing assets, professional transitions, and create stunning YouTube thumbnails instantly. Join 1000+ creators today!
              </p>
              <div className="flex gap-3">
                <Link
                  to="/store"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Get Free Assets →
                </Link>
                <button
                  onClick={() => {
                    setShowExitIntent(false);
                    setIsHidden(true);
                  }}
                  className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showFloating && !isHidden && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                boxShadow: [
                  'none',
                  '0 0 20px rgba(168, 85, 247, 0.6)',
                  'none'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="group"
            >
              <Link
                to="/store"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <SparklesIcon className="w-5 h-5" />
                <span>Browse Free Assets</span>
              </Link>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                👆
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCTA;
