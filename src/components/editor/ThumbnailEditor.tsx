import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import CanvasStage from './CanvasStage';
import LeftToolbar from './LeftToolbar';
import TopToolbar from './TopToolbar';
import PropertiesPanel from './PropertiesPanel';
import DownloadModal from './DownloadModal';
import toast from 'react-hot-toast';
import PageSEO from '../SEO/PageSEO';

const ThumbnailEditor: React.FC = () => {

  const navigate = useNavigate();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  // Check orientation
  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 768;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  useEffect(() => {
    // Add keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const undoBtn = document.querySelector('[title="Undo (Ctrl+Z)"]') as HTMLButtonElement;
        undoBtn?.click();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        const redoBtn = document.querySelector('[title="Redo (Ctrl+Y)"]') as HTMLButtonElement;
        redoBtn?.click();
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeElement = document.activeElement;
        // Only delete if not typing in an input
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const deleteBtn = document.querySelector('[title="Delete Selected (Delete)"]') as HTMLButtonElement;
          deleteBtn?.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
  };

  // Show rotate prompt for mobile portrait mode
  if (isPortrait) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 p-6">
        <div className="text-center max-w-md">
          <motion.div
            animate={{ rotate: [0, -90, -90, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="text-8xl mb-6"
          >
            📱
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Rotate Your Device</h2>
          <p className="text-gray-300 text-lg mb-6">
            For the best editing experience, please rotate your phone to landscape mode (horizontal).
          </p>
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
            <p className="text-purple-200 text-sm">
              💡 Tip: The thumbnail editor works best in landscape orientation for easy access to all tools.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      <PageSEO
        title="Free Thumbnail Maker - EditorVault"
        description="Create stunning YouTube thumbnails for free with our online design tool. No login required."
        keywords={['thumbnail maker', 'youtube thumbnail editor', 'free design tool', 'online editor']}
      />
      {/* Top Toolbar */}
      <TopToolbar onDownload={handleDownloadClick} />

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Toolbar - Design Tools */}
        <LeftToolbar />

        {/* Canvas Area - Center with glow effect */}
        <div className="flex-1 flex items-center justify-center p-2 sm:p-3 relative overflow-hidden md:overflow-hidden overflow-auto">
          {/* Glow effect behind canvas */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[450px] bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 blur-3xl"></div>
          </div>
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <CanvasStage />
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="hidden sm:block w-56 sm:w-64 md:w-72 lg:w-80 bg-gray-900/50 backdrop-blur-sm border-l border-gray-800 p-3 sm:p-4 overflow-y-auto">
          <PropertiesPanel />
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Tutorial Hint - Shows on first visit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-6 py-3 rounded-full shadow-2xl pointer-events-none z-40 backdrop-blur-sm border border-white/20"
      >
        <p className="text-xs font-semibold flex items-center space-x-2">
          <span className="text-xl">🎨</span>
          <span>Start creating! Add text and images. Properties panel is on the right</span>
        </p>
      </motion.div>
    </div>
  );
};

export default ThumbnailEditor;
