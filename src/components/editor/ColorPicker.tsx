import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  className = ''
}) => {
  const [showPalette, setShowPalette] = useState(false);

  // Common colors palette
  const colors = [
    '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00', '#ADFF2F',
    '#00FF00', '#00CED1', '#00BFFF', '#0000FF', '#8A2BE2', '#FF00FF',
    '#FF1493', '#FF69B4', '#FFC0CB', '#FFFFFF', '#F0F0F0', '#D3D3D3',
    '#A9A9A9', '#808080', '#696969', '#483D8B', '#2F4F4F', '#000000'
  ];

  const handleColorClick = (color: string) => {
    onChange(color);
    setShowPalette(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="text-cyan-300 text-sm font-semibold mb-3 block">
        {label}
      </label>
      
      <div className="space-y-3">
        {/* Color preview button - larger and more visible */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowPalette(!showPalette)}
            className="w-20 h-20 rounded-2xl border-4 border-white/50 hover:border-white/80 transition-all duration-200 cursor-pointer relative overflow-hidden shadow-2xl hover:shadow-2xl transform hover:scale-105 ring-2 ring-gray-700/50"
            style={{ backgroundColor: value, boxShadow: `0 4px 20px ${value}60, inset 0 1px 0 rgba(255,255,255,0.1)` }}
          >
            <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-lg drop-shadow-lg">🎨</span>
            </div>
            {/* Color indicator ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-2xl opacity-30 blur-sm -z-10"></div>
          </button>
        </div>

        {/* Color palette */}
        <AnimatePresence>
          {showPalette && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900/95 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 shadow-2xl"
            >
              <h4 className="text-white text-sm font-medium mb-3 text-center">Choose a Color</h4>
              <div className="grid grid-cols-6 gap-3">
                {colors.map((color, index) => (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => handleColorClick(color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 relative ${
                      value === color 
                        ? 'border-white shadow-lg ring-2 ring-cyan-400 scale-105' 
                        : 'border-gray-600 hover:border-white/60'
                    }`}
                    style={{ 
                      backgroundColor: color,
                      boxShadow: value === color ? `0 0 15px ${color}60` : 'none'
                    }}
                    title={color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {value === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs drop-shadow-lg">✓</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
              
              {/* Close button */}
              <div className="flex justify-center mt-4 pt-3 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowPalette(false)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ColorPicker;