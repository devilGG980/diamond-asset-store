import React, { useState } from 'react';
import * as fabric from 'fabric';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useEditorStore } from './useEditorStore';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AIGenerator: React.FC<Props> = ({ isOpen, onClose }) => {
  const { canvas, addObject } = useEditorStore();

  const [prompt, setPrompt] = useState('Epic YouTube thumbnail');
  const [loading, setLoading] = useState(false);

  const addToCanvas = (img: fabric.Image) => {
    if (!canvas) return;
    // Fit to cover canvas while preserving aspect
    const w = img.width || 1;
    const h = img.height || 1;
    const scale = Math.max(canvas.width! / w, canvas.height! / h);
    const scaledW = w * scale;
    const scaledH = h * scale;
    img.set({
      left: (canvas.width! - scaledW) / 2,
      top: (canvas.height! - scaledH) / 2,
      scaleX: scale,
      scaleY: scale,
    });
    addObject(img);
    canvas?.renderAll();
  };

  const handleGenerate = async () => {
    if (!canvas) return toast.error('Canvas not ready');

    try {
      setLoading(true);

      // Use local proxy to avoid CORS/taint issues
      const params = new URLSearchParams({ prompt, width: '1280', height: '720', provider: 'subnp', seed: String(Math.floor(Math.random() * 1000000)) });
      const resp = await fetch(`/api/gen-image?${params.toString()}`, { cache: 'no-store' });
      if (!resp.ok) throw new Error('Image generation failed');
      const blob = await resp.blob();
      // Convert blob to data URL for reliable Fabric loading
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(blob);
      });

      const img = await fabric.Image.fromURL(dataUrl);
      addToCanvas(img);
      toast.success('AI image added to canvas ✨');
      onClose();
    } catch (e: any) {
      toast.error(e?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-2xl max-w-lg w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <div className="flex items-center gap-2 text-white font-bold">
              <SparklesIcon className="h-5 w-5 text-yellow-400" /> Generate by AI - FREE
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon className="h-5 w-5" /></button>
          </div>

          <div className="p-4 space-y-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Minecraft battle thumbnail"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5" /> Generate FREE
                </>
              )}
            </button>

            <div className="text-xs text-gray-500">Provider: SUBNP (configurable). You can set window.SUBNP_BASE_URL to point to your instance.</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIGenerator;
