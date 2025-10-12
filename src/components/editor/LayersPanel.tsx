import React, { useEffect, useState } from 'react';
import { useEditorStore } from './useEditorStore';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import * as fabric from 'fabric';
import toast from 'react-hot-toast';

interface Layer {
  id: string;
  object: fabric.Object;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
}

const LayersPanel: React.FC = () => {
  const { canvas, setActiveObject, deleteActiveObject } = useEditorStore();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects();
      const newLayers: Layer[] = objects.map((obj, index) => {
        // @ts-ignore
        const objId = obj.id || `layer_${index}`;
        return {
          id: objId,
          object: obj,
          name: getLayerName(obj, index),
          type: obj.type || 'object',
          visible: obj.visible !== false,
          locked: obj.selectable === false,
        };
      });
      setLayers(newLayers.reverse()); // Reverse to show top layers first
    };

    updateLayers();

    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    canvas.on('selection:created', (e) => {
      // @ts-ignore
      const id = e.selected?.[0]?.id;
      setSelectedLayerId(id);
    });
    canvas.on('selection:updated', (e) => {
      // @ts-ignore
      const id = e.selected?.[0]?.id;
      setSelectedLayerId(id);
    });
    canvas.on('selection:cleared', () => {
      setSelectedLayerId(null);
    });

    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
    };
  }, [canvas]);

  const getLayerName = (obj: fabric.Object, index: number): string => {
    const type = obj.type;
    if (type === 'i-text' || type === 'text') {
      // @ts-ignore
      const text = obj.text || '';
      return text.substring(0, 20) + (text.length > 20 ? '...' : '');
    }
    if (type === 'image') return `Image ${index + 1}`;
    if (type === 'rect') return `Rectangle ${index + 1}`;
    if (type === 'circle') return `Circle ${index + 1}`;
    if (type === 'path') return `Shape ${index + 1}`;
    if (type === 'triangle') return `Triangle ${index + 1}`;
    return `Layer ${index + 1}`;
  };

  const getLayerIcon = (type: string): string => {
    switch (type) {
      case 'i-text':
      case 'text':
        return '📝';
      case 'image':
        return '🖼️';
      case 'rect':
        return '⬛';
      case 'circle':
        return '⚫';
      case 'triangle':
        return '🔺';
      case 'path':
        return '⭐';
      default:
        return '📄';
    }
  };

  const handleLayerClick = (layer: Layer) => {
    if (!canvas) return;
    canvas.setActiveObject(layer.object);
    canvas.renderAll();
    setActiveObject(layer.object as any);
    setSelectedLayerId(layer.id);
  };

  const toggleVisibility = (layer: Layer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;
    
    layer.object.set({ visible: !layer.visible });
    canvas.renderAll();
    setLayers([...layers]);
  };

  const toggleLock = (layer: Layer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;
    
    const newLocked = !layer.locked;
    layer.object.set({
      selectable: !newLocked,
      evented: !newLocked,
    });
    canvas.renderAll();
    setLayers([...layers]);
  };

  const duplicateLayer = async (layer: Layer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;
    
    try {
      // Clone the object using Fabric v6 API
      const cloned = await layer.object.clone();
      
      // Offset the cloned object
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      });
      
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      
      toast.success('Layer duplicated!');
    } catch (error) {
      console.error('Error duplicating layer:', error);
      toast.error('Failed to duplicate layer');
    }
  };

  const deleteLayer = (layer: Layer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;
    
    canvas.remove(layer.object);
    canvas.renderAll();
  };

  const moveLayerUp = (layer: Layer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;
    
    canvas.bringObjectForward(layer.object);
    canvas.renderAll();
  };

  const moveLayerDown = (layer: Layer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvas) return;
    
    canvas.sendObjectBackwards(layer.object);
    canvas.renderAll();
  };

  return (
    <div className="bg-gray-800 rounded-lg flex flex-col min-w-[288px]">
      <div className="p-3 border-b border-gray-800">
        <h3 className="text-white font-bold text-base">Layers</h3>
        <p className="text-gray-400 text-xs mt-1">{layers.length} objects</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {layers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No layers yet<br />
            Start adding elements
          </div>
        ) : (
          layers.map((layer, index) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => handleLayerClick(layer)}
              className={`group relative p-2 rounded-lg cursor-pointer transition-all ${
                selectedLayerId === layer.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                {/* Icon */}
                <span className="text-lg">{getLayerIcon(layer.type)}</span>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{layer.name}</p>
                  <p className="text-xs opacity-70">{layer.type}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Visibility */}
                  <button
                    onClick={(e) => toggleVisibility(layer, e)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title={layer.visible ? 'Hide' : 'Show'}
                  >
                    {layer.visible ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeSlashIcon className="h-4 w-4" />
                    )}
                  </button>

                  {/* Lock */}
                  <button
                    onClick={(e) => toggleLock(layer, e)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title={layer.locked ? 'Unlock' : 'Lock'}
                  >
                    {layer.locked ? (
                      <LockClosedIcon className="h-4 w-4" />
                    ) : (
                      <LockOpenIcon className="h-4 w-4" />
                    )}
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={(e) => duplicateLayer(layer, e)}
                    className="p-1 hover:bg-gray-600 rounded"
                    title="Duplicate"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => deleteLayer(layer, e)}
                    className="p-1 hover:bg-red-600 rounded"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Move Up/Down Buttons */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col">
                <button
                  onClick={(e) => moveLayerUp(layer, e)}
                  className="p-0.5 hover:bg-gray-600 rounded text-xs"
                  title="Move Up"
                >
                  ▲
                </button>
                <button
                  onClick={(e) => moveLayerDown(layer, e)}
                  className="p-0.5 hover:bg-gray-600 rounded text-xs"
                  title="Move Down"
                >
                  ▼
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
