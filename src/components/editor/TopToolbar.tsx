import React, { useState } from 'react';
import { useEditorStore } from './useEditorStore';
import { useAuth } from '../../contexts/AuthContext';
import AlignmentTools from './AlignmentTools';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface TopToolbarProps {
  onDownload: () => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({ onDownload }) => {
  const { 
    canvas, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    clearCanvas,
    activeObject,
    deleteActiveObject,
  } = useEditorStore();
  
  const { userProfile } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire canvas? This cannot be undone.')) {
      clearCanvas();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    if (canvas) {
      const zoom = canvas.getZoom();
      canvas.setZoom(Math.min(zoom * 1.1, 3));
      canvas.renderAll();
    }
  };

  const handleZoomOut = () => {
    if (canvas) {
      const zoom = canvas.getZoom();
      canvas.setZoom(Math.max(zoom * 0.9, 0.1));
      canvas.renderAll();
    }
  };

  const handleZoomReset = () => {
    if (canvas) {
      canvas.setZoom(1);
      canvas.renderAll();
    }
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Editor Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gradient">Thumbnail Editor</h2>
          <div className="text-gray-400 text-sm">
            YouTube Size: 1280x720
          </div>
        </div>

        {/* Middle Section - Tools */}
        <div className="flex items-center space-x-2">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className={`p-2 rounded transition-colors ${
                canUndo()
                  ? 'text-white hover:bg-gray-700'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <ArrowUturnLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className={`p-2 rounded transition-colors ${
                canRedo()
                  ? 'text-white hover:bg-gray-700'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <ArrowUturnRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
              title="Zoom Out"
            >
              <span className="text-sm font-bold">−</span>
            </button>
            <button
              onClick={handleZoomReset}
              className="px-3 py-1 text-white hover:bg-gray-700 rounded transition-colors text-sm"
              title="Reset Zoom"
            >
              100%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
              title="Zoom In"
            >
              <span className="text-sm font-bold">+</span>
            </button>
          </div>

          {/* Alignment Tools */}
          <AlignmentTools />

          {/* Delete Selected */}
          {activeObject && (
            <AnimatePresence>
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={deleteActiveObject}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                title="Delete Selected (Delete)"
              >
                <TrashIcon className="h-5 w-5" />
              </motion.button>
            </AnimatePresence>
          )}

          {/* Clear Canvas */}
          <button
            onClick={handleClear}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            title="Clear Canvas"
          >
            <TrashIcon className="h-5 w-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="h-5 w-5" />
            ) : (
              <ArrowsPointingOutIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Right Section - Diamond Balance & Download */}
        <div className="flex items-center space-x-4">
          {/* Diamond Balance */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 rounded-full">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="text-xl"
            >
              💎
            </motion.div>
            <span className="font-bold text-black">
              {userProfile?.diamondBalance?.toLocaleString() || '0'}
            </span>
          </div>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="btn-primary flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Download (10💎)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;
