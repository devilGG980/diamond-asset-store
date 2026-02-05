import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from './useEditorStore';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const { canvas } = useEditorStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  React.useEffect(() => {
    if (isOpen && canvas) {
      // Generate preview
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 0.3, // Lower quality for preview
      });
      setPreviewUrl(dataUrl);
    }
  }, [isOpen, canvas]);

  const handleDownload = async () => {
    if (!canvas) {
      toast.error('No canvas to download');
      return;
    }

    setIsProcessing(true);

    try {
      // Download
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2, // High quality for download
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `thumbnail_${timestamp}.png`;

      // Download using FileSaver.js
      saveAs(blob, filename);

      toast.success(
        `✅ Thumbnail downloaded successfully!`,
        { duration: 3000 }
      );

      onClose();
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Download failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-75"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full border border-gray-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-600 to-cyan-500 p-2 rounded-lg">
                <ArrowDownTrayIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Download Thumbnail</h2>
                <p className="text-gray-400 text-sm">High-quality PNG (1280x720) - FREE</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Preview */}
            {previewUrl && (
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-3 font-medium">Preview:</p>
                <img
                  src={previewUrl}
                  alt="Thumbnail Preview"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Info */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-yellow-400" />
                What you'll get:
              </h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>✅ High-quality PNG image (1280x720)</li>
                <li>✅ Perfect for YouTube thumbnails</li>
                <li>✅ Transparent background support</li>
                <li>✅ Instant download - 100% FREE!</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      ⚙️
                    </motion.div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span>Download FREE</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="btn-secondary py-3 px-6"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DownloadModal;
