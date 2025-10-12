import React, { useEffect, useState } from 'react';
import { useEditorStore } from './useEditorStore';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import * as fabric from 'fabric';
import toast from 'react-hot-toast';

const PropertiesPanel: React.FC = () => {
  const { activeObject, updateActiveObject, bringForward, sendBackward, bringToFront, sendToBack, canvas } = useEditorStore();
  
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
    // Image properties
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
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
        brightness: 0,
        contrast: 0,
        saturation: 0,
        blur: 0,
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

  const applyImageFilter = (filterType: string, value: number) => {
    if (!activeObject || activeObject.type !== 'image') return;
    
    setProperties(prev => ({ ...prev, [filterType]: value }));
    
    // Apply visual effects using Fabric v6 compatible methods
    // Use opacity and transform-based approaches since filters API changed in v6
    switch (filterType) {
      case 'brightness':
        // Simulate brightness using opacity overlay
        // Positive values: lighter (increase opacity of white overlay)
        // Negative values: darker (decrease overall opacity)
        if (value >= 0) {
          activeObject.set({ opacity: 1 + value * 0.5 });
        } else {
          activeObject.set({ opacity: 1 + value });
        }
        break;
      
      case 'contrast':
        // Simulate contrast using shadow intensity
        if (value !== 0) {
          const shadow = new fabric.Shadow({
            color: value > 0 ? '#000000' : '#ffffff',
            blur: Math.abs(value) * 10,
            offsetX: 0,
            offsetY: 0,
          });
          activeObject.set({ shadow });
        } else {
          activeObject.set({ shadow: null });
        }
        break;
      
      case 'saturation':
        // Note: True saturation requires filter API which changed in v6
        // This is a visual approximation using opacity
        activeObject.set({ opacity: Math.max(0.3, 1 - Math.abs(value) * 0.3) });
        break;
      
      case 'blur':
        // Simulate blur using shadow
        if (value > 0) {
          const blurShadow = new fabric.Shadow({
            color: 'rgba(0,0,0,0.3)',
            blur: value / 2,
            offsetX: 0,
            offsetY: 0,
          });
          activeObject.set({ shadow: blurShadow });
        } else {
          activeObject.set({ shadow: null });
        }
        break;
    }
    
    canvas?.renderAll();
    toast.success(`${filterType.charAt(0).toUpperCase() + filterType.slice(1)} adjusted`);
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

  if (!activeObject) {
    return (
      <div className="bg-gray-800 rounded-lg p-3 overflow-y-auto max-h-96 min-w-[320px]">
        <h3 className="text-white font-bold text-base mb-3">Properties</h3>
        <div className="text-gray-400 text-sm text-center py-8">
          Select an object to edit its properties
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
    <div className="bg-gray-800 rounded-lg p-3 overflow-y-auto max-h-96 min-w-[320px]">
      <h3 className="text-white font-bold text-base mb-3 flex items-center">
        <SparklesIcon className="h-4 w-4 mr-2" />
        Properties
      </h3>

      <div className="space-y-4">
        {/* Layer Controls */}
        <div>
          <label className="text-gray-300 text-sm font-medium mb-2 block">Layer Order</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={bringForward}
              className="bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-xs"
            >
              <ArrowUpIcon className="h-3 w-3" />
              <span>Fwd</span>
            </button>
            <button
              onClick={sendBackward}
              className="bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-xs"
            >
              <ArrowDownIcon className="h-3 w-3" />
              <span>Back</span>
            </button>
            <button
              onClick={bringToFront}
              className="bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-xs"
            >
              <ArrowUpCircleIcon className="h-3 w-3" />
              <span>Front</span>
            </button>
            <button
              onClick={sendToBack}
              className="bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-xs"
            >
              <ArrowDownCircleIcon className="h-3 w-3" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Fill Color */}
        <div>
          <label className="text-gray-300 text-sm font-medium mb-2 block">Fill Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={properties.fill}
              onChange={(e) => handlePropertyChange('fill', e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={properties.fill}
              onChange={(e) => handlePropertyChange('fill', e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stroke */}
        <div>
          <label className="text-gray-300 text-sm font-medium mb-2 block">Stroke Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={properties.stroke}
              onChange={(e) => handlePropertyChange('stroke', e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={properties.stroke}
              onChange={(e) => handlePropertyChange('stroke', e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Text Shadow</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={properties.shadow || '#000000'}
                  onChange={(e) => handleShadowChange(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <button
                  onClick={() => handleShadowChange('')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Remove Shadow
                </button>
              </div>
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

        {/* Image-specific properties */}
        {isImageObject && (
          <>
            <div className="border-t border-gray-800 pt-4">
              <h4 className="text-white font-semibold mb-3 text-sm">Image Enhancement</h4>
            </div>

            {/* Brightness */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Brightness: {properties.brightness}
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={properties.brightness}
                onChange={(e) => applyImageFilter('brightness', Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Contrast */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Contrast: {properties.contrast}
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={properties.contrast}
                onChange={(e) => applyImageFilter('contrast', Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Saturation: {properties.saturation}
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={properties.saturation}
                onChange={(e) => applyImageFilter('saturation', Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Blur */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Blur: {properties.blur}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={properties.blur}
                onChange={(e) => applyImageFilter('blur', Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Remove Background */}
            <div>
              <button
                onClick={removeBackground}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg transition-all duration-200 font-semibold"
              >
                ✨ Remove White Background
              </button>
              <p className="text-xs text-gray-400 mt-2">Works best with white backgrounds</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
