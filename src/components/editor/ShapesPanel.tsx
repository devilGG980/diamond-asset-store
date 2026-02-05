import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEditorStore } from './useEditorStore';
import * as fabric from 'fabric';
import toast from 'react-hot-toast';

interface ShapesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShapesPanel: React.FC<ShapesPanelProps> = ({ isOpen, onClose }) => {
  const { canvas, addObject } = useEditorStore();

  const shapes = [
    {
      name: 'Rectangle',
      icon: '⬛',
      color: '#ff6b6b',
      create: () => new fabric.Rect({
        left: canvas!.width! / 2 - 75,
        top: canvas!.height! / 2 - 50,
        width: 150,
        height: 100,
        fill: '#ff6b6b',
        stroke: '#ffffff',
        strokeWidth: 3,
        rx: 10,
        ry: 10,
      })
    },
    {
      name: 'Circle',
      icon: '⚫',
      color: '#4ecdc4',
      create: () => new fabric.Circle({
        left: canvas!.width! / 2 - 50,
        top: canvas!.height! / 2 - 50,
        radius: 50,
        fill: '#4ecdc4',
        stroke: '#ffffff',
        strokeWidth: 3,
      })
    },
    {
      name: 'Triangle',
      icon: '🔺',
      color: '#ffa726',
      create: () => new fabric.Triangle({
        left: canvas!.width! / 2 - 40,
        top: canvas!.height! / 2 - 40,
        width: 80,
        height: 80,
        fill: '#ffa726',
        stroke: '#ffffff',
        strokeWidth: 3,
      })
    },
    {
      name: 'Arrow',
      icon: '➡️',
      color: '#9c88ff',
      create: () => {
        const arrowPath = 'M 0 10 L 50 10 L 40 0 L 60 15 L 40 30 L 50 20 L 0 20 Z';
        return new fabric.Path(arrowPath, {
          left: canvas!.width! / 2 - 30,
          top: canvas!.height! / 2 - 15,
          fill: '#9c88ff',
          stroke: '#ffffff',
          strokeWidth: 2,
          scaleX: 2,
          scaleY: 2,
        });
      }
    },
    {
      name: 'Star',
      icon: '⭐',
      color: '#ffd700',
      create: () => {
        const starPath = 'M 50 10 L 60 40 L 90 40 L 70 60 L 80 90 L 50 70 L 20 90 L 30 60 L 10 40 L 40 40 Z';
        return new fabric.Path(starPath, {
          left: canvas!.width! / 2 - 40,
          top: canvas!.height! / 2 - 40,
          fill: '#ffd700',
          stroke: '#ffffff',
          strokeWidth: 2,
          scaleX: 0.8,
          scaleY: 0.8,
        });
      }
    },
    {
      name: 'Heart',
      icon: '❤️',
      color: '#ff4757',
      create: () => {
        const heartPath = 'M 50 20 C 50 10, 35 10, 35 25 C 35 10, 20 10, 20 25 C 20 40, 50 70, 50 70 C 50 70, 80 40, 80 25 C 80 10, 65 10, 65 25 C 65 10, 50 10, 50 20 Z';
        return new fabric.Path(heartPath, {
          left: canvas!.width! / 2 - 40,
          top: canvas!.height! / 2 - 35,
          fill: '#ff4757',
          stroke: '#ffffff',
          strokeWidth: 2,
          scaleX: 0.8,
          scaleY: 0.8,
        });
      }
    }
  ];

  const addShape = (shape: typeof shapes[0]) => {
    if (!canvas) return;

    const shapeObject = shape.create();
    addObject(shapeObject);
    toast.success(`${shape.name} added! 🎨`);
  };

  const addGradientBackground = () => {
    if (!canvas) return;

    const gradient = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: 0,
        y1: 0,
        x2: canvas.width!,
        y2: canvas.height!,
      },
      colorStops: [
        { offset: 0, color: '#667eea' },
        { offset: 1, color: '#764ba2' },
      ],
    });

    const backgroundRect = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.width!,
      height: canvas.height!,
      fill: gradient,
      selectable: false,
    });

    canvas.add(backgroundRect);
    canvas.sendObjectToBack(backgroundRect);
    canvas.renderAll();
    toast.success('Gradient background added! ✨');
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
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-2xl max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🔷</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Shapes</h3>
                <p className="text-gray-400 text-xs">Add shapes to your canvas</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Shapes Grid */}
            <div className="grid grid-cols-3 gap-3">
              {shapes.map((shape, index) => (
                <button
                  key={index}
                  onClick={() => addShape(shape)}
                  className="group bg-gray-800/50 hover:bg-gray-700 p-3 rounded-lg transition-all hover:scale-105 border border-gray-700/30 hover:border-gray-600"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {shape.icon}
                  </div>
                  <div className="text-gray-300 text-xs font-medium">{shape.name}</div>
                </button>
              ))}
            </div>

            {/* Background Section */}
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-white font-semibold text-sm mb-3">Backgrounds</h4>
              <button
                onClick={addGradientBackground}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all font-medium text-sm"
              >
                ✨ Add Gradient Background
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShapesPanel;