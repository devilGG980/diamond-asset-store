import React, { useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from './useEditorStore';
import StickersPanel from './StickersPanel';
import BrushesTool from './BrushesTool';
import ShapesPanel from './ShapesPanel';
import BackgroundsPanel from './BackgroundsPanel';
import AssetsPanel from './AssetsPanel';
import GlowTool from './GlowTool';
import { useNavigate } from 'react-router-dom';

import {
  PhotoIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  FaceSmileIcon,
  PaintBrushIcon,
  SwatchIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LeftToolbar: React.FC = () => {
  const { canvas, addObject, setShowLayers } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showStickers, setShowStickers] = useState(false);
  const [showBrushes, setShowBrushes] = useState(false);
  const [showShapes, setShowShapes] = useState(false);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [showAssets, setShowAssets] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      fabric.Image.fromURL(imgUrl).then((img) => {
        // Scale image to fit canvas if too large
        const maxWidth = canvas.width! * 0.8;
        const maxHeight = canvas.height! * 0.8;
        
        if (img.width! > maxWidth || img.height! > maxHeight) {
          const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!);
          img.scale(scale);
        }
        
        img.set({
          left: (canvas.width! - img.getScaledWidth()) / 2,
          top: (canvas.height! - img.getScaledHeight()) / 2,
        });
        
        addObject(img);
        toast.success('Image added to canvas');
      }).catch((error) => {
        console.error('Error loading image:', error);
        toast.error('Failed to load image');
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addText = () => {
    if (!canvas) return;

    const text = new fabric.IText('Your Text Here', {
      left: canvas.width! / 2 - 100,
      top: canvas.height! / 2,
      fontSize: 60,
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      textAlign: 'center',
      fontWeight: 'bold',
    });

    addObject(text);
    toast.success('Text added to canvas');
  };

  // Compact tools array
  const tools = [
    {
      icon: SparklesIcon,
      label: 'Assets',
      onClick: () => setShowAssets(true),
      color: 'bg-cyan-600 hover:bg-cyan-700',
    },
    {
      icon: PhotoIcon,
      label: 'Images',
      onClick: () => fileInputRef.current?.click(),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      icon: DocumentTextIcon,
      label: 'Text',
      onClick: addText,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: Squares2X2Icon,
      label: 'Shapes',
      onClick: () => setShowShapes(true),
      color: 'bg-red-600 hover:bg-red-700',
    },
    {
      icon: FaceSmileIcon,
      label: 'Stickers',
      onClick: () => setShowStickers(true),
      color: 'bg-pink-600 hover:bg-pink-700',
    },
    {
      icon: PaintBrushIcon,
      label: 'Brushes',
      onClick: () => setShowBrushes(true),
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
    {
      icon: SparklesIcon,
      label: 'Glow',
      onClick: () => setShowGlow(true),
      color: 'bg-violet-600 hover:bg-violet-700',
    },
    {
      icon: DocumentTextIcon,
      label: 'Crop',
      onClick: () => navigate('/pen-crop'),
      color: 'bg-teal-600 hover:bg-teal-700',
    },
    {
      icon: SwatchIcon,
      label: 'Backgrounds',
      onClick: () => setShowBackgrounds(true),
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      icon: RectangleStackIcon,
      label: 'Layers',
      onClick: () => setShowLayers?.(true),
      color: 'bg-green-600 hover:bg-green-700',
    },
  ];



  return (
    <div className="w-40 sm:w-48 md:w-56 lg:w-64 bg-gray-900 border-r border-gray-800 p-2 overflow-y-auto flex-shrink-0">
      <h3 className="text-white font-bold text-xs sm:text-sm mb-2">Tools</h3>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Tool buttons */}
      <div className="space-y-1.5">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <button
              key={index}
              onClick={tool.onClick}
              className={`w-full ${tool.color} text-white py-2 px-2 rounded-md transition-all duration-200 flex items-center space-x-2 hover:scale-[1.02]`}
            >
              <Icon className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs font-medium hidden sm:inline">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Shapes Panel */}
      <ShapesPanel
        isOpen={showShapes}
        onClose={() => setShowShapes(false)}
      />

      {/* Stickers Panel */}
      <StickersPanel
        isOpen={showStickers}
        onClose={() => setShowStickers(false)}
      />

      {/* Brushes Tool */}
      <BrushesTool
        isOpen={showBrushes}
        onClose={() => setShowBrushes(false)}
      />

      {/* Assets Panel */}
      <AssetsPanel
        isOpen={showAssets}
        onClose={() => setShowAssets(false)}
      />

      {/* Glow Tool */}
      <GlowTool
        isOpen={showGlow}
        onClose={() => setShowGlow(false)}
      />


      {/* Backgrounds Panel */}
      <BackgroundsPanel
        isOpen={showBackgrounds}
        onClose={() => setShowBackgrounds(false)}
      />
    </div>
  );
};

export default LeftToolbar;
