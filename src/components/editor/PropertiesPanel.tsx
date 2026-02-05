import React, { useEffect, useState } from 'react';
import { useEditorStore } from './useEditorStore';
import ColorPicker from './ColorPicker';
import LayersPanel from './LayersPanel';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  SparklesIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import * as fabric from 'fabric';
import toast from 'react-hot-toast';

const PropertiesPanel: React.FC = () => {
  const { activeObject, updateActiveObject, bringForward, sendBackward, bringToFront, sendToBack, canvas, showLayers, setShowLayers } = useEditorStore();
  
  const [properties, setProperties] = useState({
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 0,
    opacity: 1,
    fontSize: 20,
    fontFamily: 'Arial',
    fontWeight: 'normal' as string,
    textAlign: 'left' as string,
    // Advanced text properties
    shadow: '',
    charSpacing: 0,
    lineHeight: 1.16,
  });

  useEffect(() => {
    if (activeObject) {
      setProperties({
        fill: (activeObject.fill as string) || '#000000',
        stroke: (activeObject.stroke as string) || '#000000',
        strokeWidth: activeObject.strokeWidth || 0,
        opacity: activeObject.opacity || 1,
        // @ts-ignore
        fontSize: activeObject.fontSize || 20,
        // @ts-ignore
        fontFamily: activeObject.fontFamily || 'Arial',
        // @ts-ignore
        fontWeight: activeObject.fontWeight || 'normal',
        // @ts-ignore
        textAlign: activeObject.textAlign || 'left',
        // @ts-ignore
        shadow: activeObject.shadow?.color || '',
        // @ts-ignore
        charSpacing: activeObject.charSpacing || 0,
        // @ts-ignore
        lineHeight: activeObject.lineHeight || 1.16,
      });
    }
  }, [activeObject]);

  const handlePropertyChange = (key: string, value: any) => {
    setProperties(prev => ({ ...prev, [key]: value }));
    updateActiveObject({ [key]: value });
  };


  const handleShadowChange = (shadowColor: string) => {
    setProperties(prev => ({ ...prev, shadow: shadowColor }));
    if (shadowColor) {
      const shadow = new fabric.Shadow({
        color: shadowColor,
        blur: 10,
        offsetX: 5,
        offsetY: 5,
      });
      updateActiveObject({ shadow });
    } else {
      updateActiveObject({ shadow: null });
    }
  };


  const removeBackground = () => {
    if (!activeObject || activeObject.type !== 'image' || !canvas) return;
    
    const confirmRemove = window.confirm(
      'This will attempt to remove white/light backgrounds. This works best with images that have solid white backgrounds. Continue?'
    );
    
    if (!confirmRemove) return;
    
    try {
      // Get the image element from the Fabric object
      const imgElement = (activeObject as any)._element;
      
      if (!imgElement) {
        toast.error('Could not process image');
        return;
      }
      
      // Create a temporary canvas to process the image
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = imgElement.width;
      tempCanvas.height = imgElement.height;
      const ctx = tempCanvas.getContext('2d');
      
      if (!ctx) {
        toast.error('Canvas context error');
        return;
      }
      
      // Draw the image
      ctx.drawImage(imgElement, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;
      
      // Remove white/light backgrounds (threshold-based)
      const threshold = 240; // Adjust this value to control sensitivity
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If pixel is close to white, make it transparent
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }
      
      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Create a new Fabric image from the processed canvas
      const dataURL = tempCanvas.toDataURL('image/png');
      
      fabric.FabricImage.fromURL(dataURL).then((newImg) => {
        // Copy properties from old image
        newImg.set({
          left: activeObject.left,
          top: activeObject.top,
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          angle: activeObject.angle,
        });
        
        // Remove old image and add new one
        canvas.remove(activeObject);
        canvas.add(newImg);
        canvas.setActiveObject(newImg);
        canvas.renderAll();
        
        toast.success('Background removed! (White areas made transparent)');
      }).catch((error) => {
        console.error('Error creating new image:', error);
        toast.error('Failed to apply background removal');
      });
      
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Failed to remove background');
    }
  };

  const isTextObject = activeObject?.type === 'i-text' || activeObject?.type === 'text';
  const isImageObject = activeObject?.type === 'image';

  // Show layers panel if showLayers is true
  if (showLayers) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg flex items-center">
              <RectangleStackIcon className="h-5 w-5 mr-2 text-green-400" />
              Layers
            </h3>
            <button
              onClick={() => setShowLayers(false)}
              className="text-gray-400 hover:text-white transition-colors text-sm bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
            >
              Close
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-1">Manage your canvas layers</p>
        </div>
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
          <LayersPanel />
        </div>
      </div>
    );
  }

  if (!activeObject) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-white font-bold text-lg mb-2 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-purple-400" />
            Properties
          </h3>
          <div className="text-gray-400 text-sm text-center py-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
              <SparklesIcon className="h-8 w-8 text-gray-500" />
            </div>
            <p className="font-medium">No Object Selected</p>
            <p className="text-xs mt-1">Click on any element to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const fonts = [
    'Arial',
    'Roboto',
    'Montserrat',
    'Poppins',
    'Bebas Neue',
    'Oswald',
    'Raleway',
    'Merriweather',
    'Playfair Display',
    'Anton',
    'Bangers',
    'Righteous',
    'Archivo Black',
    'Permanent Marker',
    'Russo One',
    'Shadows Into Light',
    'Pacifico',
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
        <h3 className="text-white font-bold text-lg mb-2 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-purple-400" />
          Properties
        </h3>
        <p className="text-gray-400 text-sm">
          {activeObject.type === 'i-text' || activeObject.type === 'text' ? '📝 Text Element' : 
           activeObject.type === 'image' ? '🖼️ Image Element' : '🎨 Shape Element'}
        </p>
      </div>
      
      {/* Properties Content */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50 space-y-6">

        {/* Layer Controls */}
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
          <label className="text-purple-300 text-sm font-semibold mb-3 block flex items-center">
            <ArrowUpIcon className="h-4 w-4 mr-2" />
            Layer Order
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={bringForward}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 text-xs font-medium shadow-lg"
            >
              <ArrowUpIcon className="h-3 w-3" />
              <span>Forward</span>
            </button>
            <button
              onClick={sendBackward}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 text-xs font-medium shadow-lg"
            >
              <ArrowDownIcon className="h-3 w-3" />
              <span>Backward</span>
            </button>
            <button
              onClick={bringToFront}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 text-xs font-medium shadow-lg"
            >
              <ArrowUpCircleIcon className="h-3 w-3" />
              <span>Front</span>
            </button>
            <button
              onClick={sendToBack}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 text-xs font-medium shadow-lg"
            >
              <ArrowDownCircleIcon className="h-3 w-3" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Fill Color */}
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
          <ColorPicker
            label="🎨 Fill Color"
            value={properties.fill}
            onChange={(color) => handlePropertyChange('fill', color)}
          />
        </div>

        {/* Stroke Color */}
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
          <ColorPicker
            label="🖖 Stroke Color"
            value={properties.stroke}
            onChange={(color) => handlePropertyChange('stroke', color)}
          />
        </div>

        {/* Stroke Width */}
        <div>
          <label className="text-gray-300 text-sm font-medium mb-2 block">
            Stroke Width: {properties.strokeWidth}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={properties.strokeWidth}
            onChange={(e) => handlePropertyChange('strokeWidth', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="text-gray-300 text-sm font-medium mb-2 block">
            Opacity: {Math.round(properties.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={properties.opacity}
            onChange={(e) => handlePropertyChange('opacity', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Text-specific properties */}
        {isTextObject && (
          <>
            <div className="border-t border-gray-800 pt-4">
              <h4 className="text-white font-semibold mb-3 text-sm">Text Properties</h4>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Font Size: {properties.fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={properties.fontSize}
                onChange={(e) => handlePropertyChange('fontSize', Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Font Family */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Font Family</label>
              <select
                value={properties.fontFamily}
                onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fonts.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Font Weight</label>
              <div className="grid grid-cols-3 gap-2">
                {['normal', 'bold', '900'].map((weight) => (
                  <button
                    key={weight}
                    onClick={() => handlePropertyChange('fontWeight', weight)}
                    className={`py-2 px-3 rounded-lg transition-colors text-sm capitalize ${
                      properties.fontWeight === weight
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {weight === '900' ? 'Black' : weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Align */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Text Align</label>
              <div className="grid grid-cols-3 gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handlePropertyChange('textAlign', align)}
                    className={`py-2 px-3 rounded-lg transition-colors text-sm capitalize ${
                      properties.textAlign === align
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Shadow */}
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
              <ColorPicker
                label="🌆 Text Shadow"
                value={properties.shadow || '#000000'}
                onChange={handleShadowChange}
              />
              <button
                onClick={() => handleShadowChange('')}
                className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium"
              >
                Remove Shadow
              </button>
            </div>

            {/* Character Spacing */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Letter Spacing: {properties.charSpacing}
              </label>
              <input
                type="range"
                min="-200"
                max="800"
                step="10"
                value={properties.charSpacing}
                onChange={(e) => handlePropertyChange('charSpacing', Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Line Height */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Line Height: {properties.lineHeight.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.01"
                value={properties.lineHeight}
                onChange={(e) => handlePropertyChange('lineHeight', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Image-specific properties - removed */}
      </div>
    </div>
  );
};

export default PropertiesPanel;
