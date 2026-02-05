import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import { useEditorStore } from './useEditorStore';
import * as fabric from 'fabric';
import toast from 'react-hot-toast';

interface BrushesToolProps {
  isOpen: boolean;
  onClose: () => void;
}

const BrushesTool: React.FC<BrushesToolProps> = ({ isOpen, onClose }) => {
  const { canvas } = useEditorStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushType, setBrushType] = useState<'pencil' | 'circle' | 'spray' | 'pattern'>('pencil');
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState('#ff6b7a');
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushLayer, setBrushLayer] = useState<fabric.Group | null>(null);
  const brushPathsRef = useRef<fabric.Path[]>([]);
  
  const originalStateRef = useRef<{
    cursor: string;
    selection: boolean;
    drawingMode: boolean;
  } | null>(null);

  // Brush configurations
  const brushTypes = [
    { 
      key: 'pencil' as const, 
      label: 'Pencil', 
      icon: '✏️', 
      description: 'Smooth pencil brush' 
    },
    { 
      key: 'circle' as const, 
      label: 'Circle', 
      icon: '⚫', 
      description: 'Circle pattern brush' 
    },
    { 
      key: 'spray' as const, 
      label: 'Spray', 
      icon: '🎨', 
      description: 'Spray paint effect' 
    },
    { 
      key: 'pattern' as const, 
      label: 'Pattern', 
      icon: '🌟', 
      description: 'Star pattern brush' 
    },
  ];

  const colors = [
    '#ff6b7a', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
    '#ffffff', '#2f3640', '#a4b0be', '#57606f', '#2c2c54'
  ];

  // Create or get the brush layer
  const createBrushLayer = useCallback(() => {
    if (!canvas) return null;
    
    if (!brushLayer) {
      // Create a new group for all brush strokes
      const newBrushLayer = new fabric.Group([], {
        left: 0,
        top: 0,
        selectable: true,
        evented: true,
      });
      
      // Set a custom name for the layer
      (newBrushLayer as any).name = 'Brush Layer';
      
      canvas.add(newBrushLayer);
      setBrushLayer(newBrushLayer);
      return newBrushLayer;
    }
    
    return brushLayer;
  }, [canvas, brushLayer]);

  // Initialize drawing mode
  const startDrawing = useCallback(() => {
    if (!canvas || isDrawing) return;

    // Create brush layer if it doesn't exist
    createBrushLayer();

    // Store original state
    originalStateRef.current = {
      cursor: canvas.defaultCursor,
      selection: canvas.selection,
      drawingMode: canvas.isDrawingMode
    };

    setIsDrawing(true);
    canvas.isDrawingMode = true;
    canvas.selection = false;

    // Configure brush based on type
    switch (brushType) {
      case 'pencil':
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.strokeLineCap = 'round';
        canvas.freeDrawingBrush.strokeLineJoin = 'round';
        break;

      case 'circle':
        canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
        break;

      case 'spray':
        canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
        (canvas.freeDrawingBrush as fabric.SprayBrush).density = 20;
        (canvas.freeDrawingBrush as fabric.SprayBrush).dotWidth = 2;
        break;

      case 'pattern':
        canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
        
        // Create star pattern
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = patternCanvas.height = 20;
        const patternCtx = patternCanvas.getContext('2d');
        
        if (patternCtx) {
          patternCtx.fillStyle = brushColor;
          patternCtx.beginPath();
          // Simple star path
          patternCtx.moveTo(10, 2);
          patternCtx.lineTo(12, 8);
          patternCtx.lineTo(18, 8);
          patternCtx.lineTo(13, 12);
          patternCtx.lineTo(15, 18);
          patternCtx.lineTo(10, 15);
          patternCtx.lineTo(5, 18);
          patternCtx.lineTo(7, 12);
          patternCtx.lineTo(2, 8);
          patternCtx.lineTo(8, 8);
          patternCtx.closePath();
          patternCtx.fill();
          
          (canvas.freeDrawingBrush as fabric.PatternBrush).getPatternSrc = () => patternCanvas;
        }
        break;
    }

    // Set opacity
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = `rgba(${hexToRgb(brushColor)?.r}, ${hexToRgb(brushColor)?.g}, ${hexToRgb(brushColor)?.b}, ${brushOpacity})`;
    }

    canvas.defaultCursor = 'crosshair';
    
    // Add event listener for path creation
    const handlePathCreated = (e: any) => {
      const path = e.path;
      if (path && brushLayer) {
        // Remove the path from canvas (it was auto-added by fabric.js)
        canvas.remove(path);
        
        // Add the path to our brush layer group
        brushLayer.add(path);
        brushPathsRef.current.push(path);
        
        canvas.renderAll();
      }
    };
    
    canvas.on('path:created', handlePathCreated);
    canvas.renderAll();

    toast.success(`${brushTypes.find(b => b.key === brushType)?.label} brush activated! 🎨`);
  }, [canvas, isDrawing, brushType, brushSize, brushColor, brushOpacity, brushLayer, createBrushLayer]);

  // Stop drawing mode
  const stopDrawing = useCallback(() => {
    if (!canvas || !isDrawing) return;

    canvas.isDrawingMode = false;
    setIsDrawing(false);
    
    // Remove path:created event listener
    canvas.off('path:created');

    // Restore original state
    if (originalStateRef.current) {
      canvas.selection = originalStateRef.current.selection;
      canvas.defaultCursor = originalStateRef.current.cursor;
      originalStateRef.current = null;
    }

    canvas.renderAll();
    toast.success('Drawing mode disabled');
  }, [canvas, isDrawing]);

  // Clear all drawings
  const clearDrawings = useCallback(() => {
    if (!canvas || !brushLayer) return;

    const pathCount = brushPathsRef.current.length;
    
    // Remove all paths from the brush layer
    brushPathsRef.current.forEach(path => brushLayer.remove(path));
    brushPathsRef.current = [];
    
    // If the brush layer is empty, remove it from canvas
    if (brushLayer.size() === 0) {
      canvas.remove(brushLayer);
      setBrushLayer(null);
    }
    
    canvas.renderAll();
    toast.success(`Cleared ${pathCount} brush strokes`);
  }, [canvas, brushLayer]);

  // Handle close
  const handleClose = useCallback(() => {
    stopDrawing();
    onClose();
  }, [stopDrawing, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (canvas && isDrawing) {
        stopDrawing();
      }
    };
  }, [canvas, isDrawing, stopDrawing]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Update brush properties when they change
  useEffect(() => {
    if (canvas && isDrawing && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = `rgba(${hexToRgb(brushColor)?.r}, ${hexToRgb(brushColor)?.g}, ${hexToRgb(brushColor)?.b}, ${brushOpacity})`;
    }
  }, [canvas, isDrawing, brushSize, brushColor, brushOpacity]);

  // Render floating controls when drawing
  if (isDrawing) {
    return (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-900 via-purple-800 to-indigo-900 rounded-xl p-4 border border-pink-700/50 shadow-2xl backdrop-blur-sm pointer-events-auto"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
                <PaintBrushIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Drawing Mode</p>
                <p className="text-gray-300 text-xs">
                  {brushTypes.find(b => b.key === brushType)?.label} • Size: {brushSize}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Quick brush size */}
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              
              {/* Quick color picker */}
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-8 h-8 rounded border-2 border-white cursor-pointer"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={clearDrawings}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all"
              >
                🗑️ Clear
              </button>
              <button
                onClick={stopDrawing}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all"
              >
                ❌ Stop
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
                <PaintBrushIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Brushes Tool</h3>
                <p className="text-gray-400 text-sm">Draw and paint on your canvas</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6 pb-8">
            {/* Brush Types */}
            <div>
              <h4 className="text-white font-semibold mb-3">Brush Type</h4>
              <div className="grid grid-cols-2 gap-3">
                {brushTypes.map((brush) => (
                  <button
                    key={brush.key}
                    onClick={() => setBrushType(brush.key)}
                    className={`p-4 rounded-lg border transition-all ${
                      brushType === brush.key
                        ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{brush.icon}</div>
                    <div className="text-sm font-medium">{brush.label}</div>
                    <div className="text-xs opacity-70 mt-1">{brush.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div>
              <h4 className="text-white font-semibold mb-3">Brush Size: {brushSize}px</h4>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-gray-400 text-xs mt-1">
                <span>1px</span>
                <span>50px</span>
              </div>
            </div>

            {/* Brush Opacity */}
            <div>
              <h4 className="text-white font-semibold mb-3">Opacity: {Math.round(brushOpacity * 100)}%</h4>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(Number(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Color Palette */}
            <div>
              <h4 className="text-white font-semibold mb-3">Brush Color</h4>
              <div className="grid grid-cols-5 gap-3 mb-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrushColor(color)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                      brushColor === color ? 'border-white' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              {/* Custom Color Picker */}
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
                />
                <span className="text-gray-300 text-sm">Custom color: {brushColor}</span>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex space-x-3 pt-6 border-t border-gray-700 bg-gray-900 sticky bottom-0 -mx-6 px-6 pb-6 rounded-b-2xl">
              <button
                onClick={startDrawing}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg transition-all font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                🎨 Start Drawing
              </button>
              <button
                onClick={clearDrawings}
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-4 px-6 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BrushesTool;