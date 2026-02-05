import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useEditorStore } from './useEditorStore';
import * as fabric from 'fabric';
import toast from 'react-hot-toast';

interface GlowToolProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlowTool: React.FC<GlowToolProps> = ({ isOpen, onClose }) => {
  const { canvas } = useEditorStore();
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  
  // Glow effect states
  const [glowColor, setGlowColor] = useState('#00ffff');
  const [glowBlur, setGlowBlur] = useState(10);
  const [glowOffsetX, setGlowOffsetX] = useState(0);
  const [glowOffsetY, setGlowOffsetY] = useState(0);
  const [glowOpacity, setGlowOpacity] = useState(1);
  const [isInnerGlow, setIsInnerGlow] = useState(false);
  const [livePreview, setLivePreview] = useState(true);

  // Predefined glow presets for thumbnails
  const glowPresets = [
    {
      name: 'Cyan Glow',
      color: '#00ffff',
      blur: 15,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.8,
      inner: false,
      icon: '💎'
    },
    {
      name: 'Fire Glow',
      color: '#ff6600',
      blur: 20,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.9,
      inner: false,
      icon: '🔥'
    },
    {
      name: 'Neon Purple',
      color: '#9d4edd',
      blur: 25,
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
      inner: false,
      icon: '💜'
    },
    {
      name: 'Green Pop',
      color: '#00ff41',
      blur: 18,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.85,
      inner: false,
      icon: '💚'
    },
    {
      name: 'Gold Shine',
      color: '#ffd700',
      blur: 12,
      offsetX: 2,
      offsetY: 2,
      opacity: 0.7,
      inner: false,
      icon: '✨'
    },
    {
      name: 'Red Alert',
      color: '#ff0040',
      blur: 20,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.9,
      inner: false,
      icon: '🚨'
    },
    {
      name: 'Soft White',
      color: '#ffffff',
      blur: 15,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.6,
      inner: false,
      icon: '🤍'
    },
    {
      name: 'Inner Glow',
      color: '#00d4ff',
      blur: 10,
      offsetX: 0,
      offsetY: 0,
      opacity: 0.8,
      inner: true,
      icon: '🔮'
    }
  ];

  // Update selected object when canvas selection changes
  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();
      setSelectedObject(activeObject || null);
    };

    const handleSelectionCleared = () => {
      setSelectedObject(null);
    };

    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionCreated);
    canvas.on('selection:cleared', handleSelectionCleared);

    // Check for already selected object
    const currentActive = canvas.getActiveObject();
    setSelectedObject(currentActive || null);

    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionCreated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas]);

  // Apply glow effect to selected object
  const applyGlow = useCallback((showToast: boolean = false) => {
    if (!selectedObject) return;

    try {
      // Convert hex to rgba for better opacity control
      const rgba = hexToRgba(glowColor, glowOpacity);
      
      console.log('Applying glow to:', selectedObject.type, 'with color:', rgba);
      
      // Create shadow instance for fabric.js v6+
      const shadow = new fabric.Shadow({
        color: rgba,
        blur: glowBlur,
        offsetX: glowOffsetX,
        offsetY: glowOffsetY,
        affectStroke: false,
        nonScaling: false
      });

      // Apply shadow to the object
      selectedObject.shadow = shadow;
      
      // Force canvas to re-render
      canvas?.renderAll();
      canvas?.requestRenderAll();

      // Only show toast when explicitly requested (button click)
      if (showToast) {
        toast.success(`Glow effect applied! \u2728`);
      }
      
      console.log('Shadow applied successfully:', shadow);
      
    } catch (error) {
      console.error('Error applying glow:', error);
      toast.error('Failed to apply glow effect');
    }
  }, [selectedObject, glowColor, glowBlur, glowOffsetX, glowOffsetY, glowOpacity, canvas]);

  // Remove glow effect
  const removeGlow = useCallback(() => {
    if (!selectedObject) return;

    try {
      selectedObject.shadow = null;
      canvas?.renderAll();
      canvas?.requestRenderAll();
      
      toast.success('Glow effect removed');
      
      console.log('Glow removed from:', selectedObject.type);
      
    } catch (error) {
      console.error('Error removing glow:', error);
      toast.error('Failed to remove glow effect');
    }
  }, [selectedObject, canvas]);

  // Apply preset glow
  const applyPreset = useCallback((preset: typeof glowPresets[0]) => {
    setGlowColor(preset.color);
    setGlowBlur(preset.blur);
    setGlowOffsetX(preset.offsetX);
    setGlowOffsetY(preset.offsetY);
    setGlowOpacity(preset.opacity);
    setIsInnerGlow(preset.inner);

    toast.success(`${preset.name} preset loaded! ${preset.icon}`);
    
    // Auto-apply if object is selected and live preview is on
    if (selectedObject && livePreview) {
      setTimeout(() => {
        // Apply the preset values directly
        try {
          const rgba = hexToRgba(preset.color, preset.opacity);
          const shadow = new fabric.Shadow({
            color: rgba,
            blur: preset.blur,
            offsetX: preset.offsetX,
            offsetY: preset.offsetY,
            affectStroke: false,
            nonScaling: false
          });
          
          selectedObject.shadow = shadow;
          canvas?.renderAll();
          canvas?.requestRenderAll();
          
          console.log('Preset applied:', preset.name, shadow);
          
        } catch (error) {
          console.error('Error applying preset:', error);
        }
      }, 100);
    }
  }, [selectedObject, canvas, livePreview]);

  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number): string => {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    
    // Handle 3-digit hex
    let fullHex = cleanHex;
    if (cleanHex.length === 3) {
      fullHex = cleanHex.split('').map(char => char + char).join('');
    }
    
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    if (!result) {
      console.warn('Invalid hex color:', hex);
      return `rgba(0, 255, 255, ${opacity})`; // Default to cyan
    }
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    console.log(`Converting ${hex} to ${rgba}`);
    
    return rgba;
  };

  // Auto-apply glow when settings change (if enabled) - no toast spam
  useEffect(() => {
    if (livePreview && selectedObject) {
      applyGlow(false); // false = no toast notification
    }
  }, [glowColor, glowBlur, glowOffsetX, glowOffsetY, glowOpacity, livePreview, selectedObject, applyGlow]);

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
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Glow Effects</h3>
                <p className="text-gray-400 text-sm">Add stunning glow effects to your elements</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Selection Status */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <h4 className="text-white font-medium mb-2">Selection Status:</h4>
              {selectedObject ? (
                <div className="text-green-400 text-sm flex items-center space-x-2">
                  <span>✅</span>
                  <span>Object selected - ready to apply glow effects</span>
                </div>
              ) : (
                <div className="text-yellow-400 text-sm flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>Select an object on canvas to apply glow effects</span>
                </div>
              )}
            </div>

            {/* Glow Presets */}
            <div>
              <h4 className="text-white font-semibold mb-3">🎨 Glow Presets</h4>
              <div className="grid grid-cols-4 gap-3">
                {glowPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(preset)}
                    disabled={!selectedObject}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      selectedObject
                        ? 'border-gray-600 bg-gray-800/50 hover:border-cyan-500 hover:bg-cyan-500/10'
                        : 'border-gray-700 bg-gray-800/30 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-2xl mb-1">{preset.icon}</div>
                    <div className="text-white text-xs font-medium">{preset.name}</div>
                    <div 
                      className="w-full h-2 rounded mt-2"
                      style={{ backgroundColor: preset.color, opacity: preset.opacity }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Glow Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">⚙️ Custom Glow Settings</h4>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={livePreview}
                    onChange={(e) => setLivePreview(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-gray-300 text-sm">Live Preview</span>
                </label>
              </div>

              {/* Glow Color */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Glow Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={glowColor}
                    onChange={(e) => setGlowColor(e.target.value)}
                    className="w-12 h-10 rounded border-2 border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={glowColor}
                    onChange={(e) => setGlowColor(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    placeholder="#00ffff"
                  />
                </div>
              </div>

              {/* Glow Blur */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Blur Amount: {glowBlur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={glowBlur}
                  onChange={(e) => setGlowBlur(Number(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Glow Opacity */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Opacity: {Math.round(glowOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={glowOpacity}
                  onChange={(e) => setGlowOpacity(Number(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Offset Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Offset X: {glowOffsetX}px
                  </label>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={glowOffsetX}
                    onChange={(e) => setGlowOffsetX(Number(e.target.value))}
                    className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Offset Y: {glowOffsetY}px
                  </label>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    value={glowOffsetY}
                    onChange={(e) => setGlowOffsetY(Number(e.target.value))}
                    className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Debug Info */}
            {selectedObject && (
              <div className="bg-blue-900/20 rounded-lg p-3 text-xs text-blue-300">
                <p><strong>Debug:</strong> Selected {selectedObject.type} object</p>
                <p>Current shadow: {selectedObject.shadow ? 'Yes' : 'None'}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-700 bg-gray-900 sticky bottom-0 -mx-6 px-6 pb-6 rounded-b-2xl">
              <button
                onClick={() => applyGlow(true)}
                disabled={!selectedObject}
                className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
                  selectedObject
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                ✨ Apply Glow
              </button>
              <button
                onClick={removeGlow}
                disabled={!selectedObject}
                className={`py-3 px-4 rounded-lg transition-all font-medium ${
                  selectedObject
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                🗑️ Remove
              </button>
            </div>

            {/* Tips */}
            <div className="text-xs text-gray-400 bg-gray-800/20 rounded-lg p-3">
              <p className="mb-1"><strong>💡 Pro Tips:</strong></p>
              <p>• Use cyan/blue glows for tech/gaming thumbnails</p>
              <p>• Fire/orange glows work great for action content</p>
              <p>• White glows help text stand out on dark backgrounds</p>
              <p>• Adjust offset for drop shadow effects</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlowTool;