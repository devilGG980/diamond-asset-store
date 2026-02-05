import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useEditorStore } from './useEditorStore';
import * as fabric from 'fabric';
import toast from 'react-hot-toast';

interface AssetsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Asset {
  id: string;
  name: string;
  url: string;
  filename: string;
}

const AssetsPanel: React.FC<AssetsPanelProps> = ({ isOpen, onClose }) => {
  const { canvas, addObject } = useEditorStore();
  const [builtInAssets, setBuiltInAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Progressive (sequential) thumbnail loader state
  const [visibleCount, setVisibleCount] = useState(0);
  // Render only a subset first, then progressively increase to reduce mount cost
  const [renderCount, setRenderCount] = useState(0);

  // Fetch assets from local folder (+ My Folder backgrounds)
  const toDisplayName = (filename: string) => {
    const decoded = decodeURIComponent(filename);
    const base = decoded.replace(/\.[^.]+$/, '');
    return base || filename;
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const builtIn: Asset[] = [];

      // Built-in assets
      const res1 = await fetch('/assets/index.json');
      if (res1.ok) {
        const data = await res1.json();
        let filenames: string[];
        if (Array.isArray(data)) {
          if (typeof data[0] === 'string') filenames = data;
          else if (data[0] && (data[0] as any).value) filenames = data.map((i: any) => i.value || i);
          else filenames = data as string[];
        } else filenames = [];
        filenames.forEach((filename: string, index: number) => {
          const numberMatch = filename.match(/ASSET \((\d+)\)/);
          const displayNumber = numberMatch ? numberMatch[1] : (index + 1).toString();
          builtIn.push({
            id: `asset-${filename}`,
            name: toDisplayName(filename) || `Asset ${displayNumber}`,
            filename,
            url: `/assets/${encodeURIComponent(filename)}`,
          });
        });
      }

      setBuiltInAssets(builtIn);
      if (builtIn.length > 0) toast.success(`Loaded ${builtIn.length} assets`);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  // Fetch assets when component mounts or when panel opens
  useEffect(() => {
    if (isOpen && builtInAssets.length === 0) {
      fetchAssets();
    }
  }, [isOpen]);

  // Filter assets based on search term (memoized + deferred to reduce UI stalls)
  const deferredSearch = useDeferredValue(searchTerm);
  const filteredAssets = useMemo(() => (
    builtInAssets.filter(asset => 
      asset.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      asset.filename.toLowerCase().includes(deferredSearch.toLowerCase())
    )
  ), [builtInAssets, deferredSearch]);

  // Sequentially preload filtered thumbnails to avoid loading all at once (batched updates)
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const urls = filteredAssets.map(a => a.url);
    const INITIAL = Math.min(24, urls.length);
    setVisibleCount(INITIAL);

    const BATCH = 16; // reduce re-renders: update state every 16 images
    const loadSequentially = async () => {
      let loadedInBatch = 0;
      for (let i = INITIAL; i < urls.length; i++) {
        if (cancelled) break;
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = 'async';
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = urls[i];
        });
        loadedInBatch++;
        if (!cancelled && (loadedInBatch >= BATCH || i === urls.length - 1)) {
          setVisibleCount(i + 1);
          loadedInBatch = 0;
        }
      }
    };

    loadSequentially();
    return () => { cancelled = true; };
  }, [isOpen, filteredAssets]);

  // Progressive render to avoid mounting hundreds of nodes at once
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const total = filteredAssets.length;
    const STEP = 48;
    setRenderCount(Math.min(STEP, total));

    const schedule = () => {
      if (cancelled) return;
      setRenderCount((prev) => {
        if (prev >= total) return prev;
        const next = Math.min(prev + STEP, total);
        if (!cancelled) queueMicrotask(schedule);
        return next;
      });
    };
    // Defer after paint to keep panel opening smooth
    requestAnimationFrame(() => schedule());
    return () => { cancelled = true; };
  }, [isOpen, filteredAssets]);

  const addAsset = (asset: Asset) => {
    if (!canvas) return;

    fabric.Image.fromURL(asset.url).then((img) => {
      // Scale image to reasonable size while maintaining aspect ratio
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width!, maxSize / img.height!);
      
      img.scale(scale);
      img.set({
        left: canvas.width! / 2 - (img.getScaledWidth() / 2),
        top: canvas.height! / 2 - (img.getScaledHeight() / 2),
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.3)',
          blur: 10,
          offsetX: 3,
          offsetY: 3,
        }),
      });
      
      addObject(img);
      toast.success(`${asset.name} added to canvas! 🎯`);
    }).catch((error) => {
      console.error('Error loading asset:', error);
      toast.error('Failed to load asset');
    });
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
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-2xl max-w-6xl w-full h-[600px] mx-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🎯</span>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Thumbnail Assets</h3>
                <p className="text-gray-400 text-sm">Professional design assets for your thumbnails</p>
              </div>
              <div className="ml-4 px-3 py-1 bg-cyan-600/20 border border-cyan-600/30 rounded-full">
                <span className="text-cyan-400 text-xs font-semibold">⚡ IMPORTANT</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Assets Grid */}
          <div className="flex-1 p-4 overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-white font-semibold text-lg">
                {`All Assets (${builtInAssets.length})`}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAssets}
                  className="ml-2 text-cyan-400 hover:text-cyan-300 text-sm flex items-center space-x-1 transition-colors"
                >
                  <span>🔄</span>
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-3 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                  <span className="text-sm">Loading thumbnail assets...</span>
                </div>
              </div>
            ) : filteredAssets.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <CloudArrowUpIcon className="h-16 w-16 mb-4 opacity-50" />
                {searchTerm ? (
                  <>
                    <p className="text-lg mb-2">No assets found</p>
                    <p className="text-sm text-center">
                      Try adjusting your search terms
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg mb-2">No thumbnail assets found</p>
                    <p className="text-sm text-center mb-4">
                      Assets should be in the public/assets/ folder
                    </p>
                  </>
                )}
                <button 
                  onClick={fetchAssets}
                  className="mt-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm transition-all"
                >
                  Reload Assets
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-4 max-h-96 overflow-y-auto pr-2">
                {filteredAssets.slice(0, renderCount).map((asset, index) => (
                  <motion.button
                    key={asset.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => addAsset(asset)}
                    className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-lg border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-200 hover:scale-105"
                  >
                    <div className="aspect-square mb-2 overflow-hidden rounded-md bg-gray-700/50">
                      {index < visibleCount ? (
                        <img 
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerHTML = 
                              '<div class="w-full h-full flex items-center justify-center text-gray-500 text-xs">❌<br>Error</div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full animate-pulse bg-gray-700/70" />
                      )}
                    </div>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    
                    {/* Add indicator */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">
                      +
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <span>💡 Tip: Click any asset to add it to your canvas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 font-semibold">⚡ IMPORTANT:</span>
                <span>Premium thumbnail assets</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssetsPanel;