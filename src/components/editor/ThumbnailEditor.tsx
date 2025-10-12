import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import CanvasStage from './CanvasStage';
import LeftToolbar from './LeftToolbar';
import TopToolbar from './TopToolbar';
import DownloadModal from './DownloadModal';
import toast from 'react-hot-toast';

const ThumbnailEditor: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      toast.error('Please log in to use the Thumbnail Editor');
      navigate('/');
      return;
    }

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
  }, [currentUser, navigate]);

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      {/* Top Toolbar */}
      <TopToolbar onDownload={handleDownloadClick} />

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Toolbar - Design Tools */}
        <LeftToolbar />

        {/* Canvas Area - Center with glow effect */}
        <div className="flex-1 flex items-center justify-center p-3 relative overflow-hidden">
          {/* Glow effect behind canvas */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[450px] bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <CanvasStage />
          </div>
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
          <span>Start creating! Add text and images. Use toolbar buttons for Layers & Properties</span>
        </p>
      </motion.div>
    </div>
  );
};

export default ThumbnailEditor;
