import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SwatchIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ColorSelectorProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  label,
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Predefined color palette
  const predefinedColors = [
    '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00',
    '#9AFF9A', '#00FF00', '#00CED1', '#00BFFF', '#0000FF',
    '#8A2BE2', '#FF00FF', '#FF1493', '#FF69B4', '#FFC0CB',
    '#FFFFFF', '#F0F0F0', '#D3D3D3', '#A9A9A9', '#808080',
    '#696969', '#483D8B', '#2F4F4F', '#000000', '#8B0000'
  ];

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHexInput(hex);
    
    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(hex)) {
      onChange(hex);
    }
  };

  const handleHexInputBlur = () => {
    // If invalid hex, revert to current value
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(hexInput)) {
      setHexInput(value);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    onChange(color);
    setHexInput(color);
  };

  const handlePredefinedColorClick = (color: string) => {
    onChange(color);
    setHexInput(color);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="text-cyan-300 text-sm font-semibold mb-3 block flex items-center">
        <SwatchIcon className="h-4 w-4 mr-2" />
        {label}
      </label>
      
      <div className="space-y-3">
        {/* Color Preview and Hex Input */}
        <div className="flex items-center space-x-3">
          {/* Color Preview Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-12 h-12 rounded-lg border-2 border-gray-600 hover:border-gray-400 transition-colors overflow-hidden group"
            style={{ backgroundColor: value }}
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <SwatchIcon className="h-5 w-5 text-white" />
            </div>
          </button>
          
          {/* Hex Input */}
          <div className="flex-1">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              onBlur={handleHexInputBlur}
              placeholder="#FF0000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">Enter hex color code</p>
          </div>
          
          {/* Native Color Picker Trigger */}
          <button
            onClick={() => colorInputRef.current?.click()}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            Pick
          </button>
        </div>

        {/* Collapsible Color Palette */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white text-sm font-medium">Color Palette</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            
            {/* Predefined Colors Grid */}
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((color, index) => (
                <motion.button
                  key={color}
                  onClick={() => handlePredefinedColorClick(color)}
                  className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${
                    value === color ? 'border-white shadow-lg scale-110' : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  title={color}
                />
              ))}
            </div>

            {/* Quick Gradients */}
            <div className="mt-4 pt-3 border-t border-gray-700">
              <h5 className="text-white text-xs font-medium mb-2">Quick Colors</h5>
              <div className="flex space-x-2">
                {[
                  { name: 'Red', color: '#FF4444' },
                  { name: 'Blue', color: '#4488FF' },
                  { name: 'Green', color: '#44FF44' },
                  { name: 'Yellow', color: '#FFFF44' },
                  { name: 'Purple', color: '#8844FF' },
                  { name: 'Cyan', color: '#44FFFF' }
                ].map(({ name, color }) => (
                  <button
                    key={name}
                    onClick={() => handlePredefinedColorClick(color)}
                    className="flex-1 py-1 px-2 rounded text-xs text-white font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: color }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hidden Native Color Input */}
      <input
        ref={colorInputRef}
        type="color"
        value={value}
        onChange={handleColorPickerChange}
        className="hidden"
      />
    </div>
  );
};

export default ColorSelector;