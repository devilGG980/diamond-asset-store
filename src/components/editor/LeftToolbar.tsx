import React, { useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from './useEditorStore';
import LayersPanel from './LayersPanel';
import PropertiesPanel from './PropertiesPanel';

import {
  PhotoIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LeftToolbar: React.FC = () => {
  const { canvas, addObject } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePanel, setActivePanel] = useState<'layers' | 'properties' | null>(null);

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





  const tools = [
    {
      icon: PhotoIcon,
      label: 'Upload Image',
      onClick: () => fileInputRef.current?.click(),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      icon: DocumentTextIcon,
      label: 'Add Text',
      onClick: addText,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: RectangleStackIcon,
      label: 'Layers',
      onClick: () => setActivePanel(activePanel === 'layers' ? null : 'layers'),
      color: activePanel === 'layers' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: CogIcon,
      label: 'Properties',
      onClick: () => setActivePanel(activePanel === 'properties' ? null : 'properties'),
      color: activePanel === 'properties' ? 'bg-orange-700' : 'bg-orange-600 hover:bg-orange-700',
    },
  ];



  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 p-3 overflow-y-auto flex-shrink-0 min-w-[320px]">
      <h3 className="text-white font-bold text-base mb-3">Design Tools</h3>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Tool buttons */}
      <div className="space-y-2 mb-4">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <button
              key={index}
              onClick={tool.onClick}
              className={`w-full ${tool.color} text-white py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-2 transform hover:scale-105`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel Content */}
      {activePanel === 'layers' && (
        <div className="border-t border-gray-800 pt-4">
          <LayersPanel />
        </div>
      )}
      
      {activePanel === 'properties' && (
        <div className="border-t border-gray-800 pt-4">
          <PropertiesPanel />
        </div>
      )}

    </div>
  );
};

export default LeftToolbar;
