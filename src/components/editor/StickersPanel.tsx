import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useEditorStore } from './useEditorStore';
import * as fabric from 'fabric';
import toast from 'react-hot-toast';
// Removed Supabase import - using local stickers now

interface StickersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomSticker {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

const StickersPanel: React.FC<StickersPanelProps> = ({ isOpen, onClose }) => {
  const { canvas, addObject } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState<'badges' | 'arrows' | 'shapes' | 'emojis' | 'custom'>('custom');
  const [customStickers, setCustomStickers] = useState<CustomSticker[]>([]);
  const [loadingCustom, setLoadingCustom] = useState(false);
  // Progressive (sequential) loader for custom stickers
  const [visibleCustomCount, setVisibleCustomCount] = useState(0);
  const [renderCustomCount, setRenderCustomCount] = useState(0);

  // Fetch custom stickers from local folder
  const fetchCustomStickers = async () => {
    setLoadingCustom(true);
    try {
      // Fetch the stickers index file from CDN
      const CDN_BASE = 'https://cdn.jsdelivr.net/gh/devilGG980/diamond-asset-store@main/public';
      const response = await fetch(`${CDN_BASE}/stickers/index.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch stickers index');
      }

      const filenames: string[] = await response.json();

      // Create custom stickers array with human‐readable names from filenames
      const stickersWithUrls: CustomSticker[] = filenames.map((filename, index) => {
        const decoded = decodeURIComponent(filename);
        const base = decoded.replace(/\.[^.]+$/, '');
        const display = base || `Sticker ${index + 1}`;

        return {
          id: filename,
          name: display,
          url: `${CDN_BASE}/stickers/${encodeURIComponent(filename)}`,
          created_at: '',
        };
      });

      setCustomStickers(stickersWithUrls);

      if (stickersWithUrls.length > 0) {
        toast.success(`Loaded ${stickersWithUrls.length} custom stickers! 🎨`);
      }
    } catch (error) {
      console.error('Error loading local stickers:', error);
      toast.error('Failed to load custom stickers');
    } finally {
      setLoadingCustom(false);
    }
  };

  // Fetch custom stickers when component mounts or when custom category is selected
  useEffect(() => {
    if (isOpen && activeCategory === 'custom' && customStickers.length === 0) {
      fetchCustomStickers();
    }
  }, [isOpen, activeCategory]);

  // Sequentially preload custom sticker thumbnails when visible (batched)
  useEffect(() => {
    if (!isOpen || activeCategory !== 'custom' || customStickers.length === 0) return;
    let cancelled = false;
    const urls = customStickers.map(s => s.url);
    const INITIAL = Math.min(24, urls.length);
    setVisibleCustomCount(INITIAL);
    const BATCH = 16;
    const load = async () => {
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
          setVisibleCustomCount(i + 1);
          loadedInBatch = 0;
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen, activeCategory, customStickers]);

  // Fetch custom stickers immediately when panel opens (since custom is now default)
  useEffect(() => {
    if (isOpen && customStickers.length === 0) {
      fetchCustomStickers();
    }
  }, [isOpen]);

  // Progressive render for custom stickers
  useEffect(() => {
    if (!isOpen || activeCategory !== 'custom') return;
    let cancelled = false;
    const total = customStickers.length;
    const STEP = 48;
    setRenderCustomCount(Math.min(STEP, total));
    const schedule = () => {
      if (cancelled) return;
      setRenderCustomCount((prev) => {
        if (prev >= total) return prev;
        const next = Math.min(prev + STEP, total);
        if (!cancelled) queueMicrotask(schedule);
        return next;
      });
    };
    requestAnimationFrame(() => schedule());
    return () => { cancelled = true; };
  }, [isOpen, activeCategory, customStickers]);

  // Popular YouTube/Social Media Stickers
  const stickers = {
    badges: [
      { emoji: '🔥', label: 'Fire', colors: ['#ff4757', '#ff6b7a'] },
      { emoji: '⚡', label: 'Lightning', colors: ['#ffa502', '#ffb142'] },
      { emoji: '💯', label: '100', colors: ['#ff6b7a', '#c44569'] },
      { emoji: '🆕', label: 'New', colors: ['#5352ed', '#747def'] },
      { emoji: '🔴', label: 'Live', colors: ['#ff3838', '#ff6b7a'] },
      { emoji: '✨', label: 'Sparkle', colors: ['#f1c40f', '#f39c12'] },
      { emoji: '💥', label: 'Boom', colors: ['#e74c3c', '#c0392b'] },
      { emoji: '🎯', label: 'Target', colors: ['#e55039', '#fa4443'] },
      { emoji: '💎', label: 'Diamond', colors: ['#00d2d3', '#01a3a4'] },
      { emoji: '🎉', label: 'Party', colors: ['#ff9ff3', '#f368e0'] },
    ],
    arrows: [
      { emoji: '➡️', label: 'Right Arrow', colors: ['#ff6b7a', '#c44569'] },
      { emoji: '⬇️', label: 'Down Arrow', colors: ['#5352ed', '#747def'] },
      { emoji: '⬆️', label: 'Up Arrow', colors: ['#26de81', '#20bf6b'] },
      { emoji: '↗️', label: 'Up Right', colors: ['#ffa502', '#ff9500'] },
      { emoji: '↘️', label: 'Down Right', colors: ['#fd79a8', '#e84393'] },
      { emoji: '🔽', label: 'Point Down', colors: ['#a29bfe', '#6c5ce7'] },
      { emoji: '🔼', label: 'Point Up', colors: ['#fd79a8', '#e84393'] },
      { emoji: '▶️', label: 'Play', colors: ['#00b894', '#00cec9'] },
    ],
    shapes: [
      { emoji: '⭐', label: 'Star', colors: ['#fdcb6e', '#e17055'] },
      { emoji: '💫', label: 'Dizzy', colors: ['#a29bfe', '#6c5ce7'] },
      { emoji: '🌟', label: 'Glowing Star', colors: ['#fdcb6e', '#e17055'] },
      { emoji: '❤️', label: 'Heart', colors: ['#ff7675', '#d63031'] },
      { emoji: '🔶', label: 'Diamond', colors: ['#e17055', '#d63031'] },
      { emoji: '🔸', label: 'Small Diamond', colors: ['#74b9ff', '#0984e3'] },
      { emoji: '🟡', label: 'Yellow Circle', colors: ['#fdcb6e', '#f39c12'] },
      { emoji: '🟢', label: 'Green Circle', colors: ['#00b894', '#00cec9'] },
    ],
    emojis: [
      { emoji: '😱', label: 'Shocked', colors: ['#fdcb6e', '#e17055'] },
      { emoji: '🤯', label: 'Mind Blown', colors: ['#ff7675', '#d63031'] },
      { emoji: '😍', label: 'Heart Eyes', colors: ['#fd79a8', '#e84393'] },
      { emoji: '🤩', label: 'Star Eyes', colors: ['#fdcb6e', '#e17055'] },
      { emoji: '😎', label: 'Cool', colors: ['#74b9ff', '#0984e3'] },
      { emoji: '🔥', label: 'Fire Face', colors: ['#ff6348', '#e55039'] },
      { emoji: '💪', label: 'Strong', colors: ['#ffa502', '#ff9500'] },
      { emoji: '👀', label: 'Eyes', colors: ['#a29bfe', '#6c5ce7'] },
    ]
  };

  // Text badges data
  const textBadges = [
    { text: 'NEW', bg: '#ff4757', textColor: '#ffffff' },
    { text: 'HOT', bg: '#ff6348', textColor: '#ffffff' },
    { text: 'SALE', bg: '#26de81', textColor: '#ffffff' },
    { text: '50% OFF', bg: '#ffa502', textColor: '#ffffff' },
    { text: 'LIMITED', bg: '#5352ed', textColor: '#ffffff' },
    { text: 'EXCLUSIVE', bg: '#ff3838', textColor: '#ffffff' },
    { text: 'TRENDING', bg: '#ff9ff3', textColor: '#2f3640' },
    { text: 'VIRAL', bg: '#1dd1a1', textColor: '#ffffff' },
    { text: 'MUST SEE', bg: '#feca57', textColor: '#2f3640' },
    { text: 'EPIC', bg: '#ff6b7a', textColor: '#ffffff' },
  ];

  const addSticker = (sticker: { emoji: string; label: string; colors: string[] }) => {
    if (!canvas) return;

    const text = new fabric.IText(sticker.emoji, {
      left: canvas.width! / 2 - 30,
      top: canvas.height! / 2 - 30,
      fontSize: 60,
      fontFamily: 'Arial',
      textAlign: 'center',
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 10,
        offsetX: 3,
        offsetY: 3,
      }),
    });

    addObject(text);
    toast.success(`${sticker.label} sticker added! 🎉`);
  };

  const addCustomSticker = (customSticker: CustomSticker) => {
    if (!canvas) return;

    fabric.Image.fromURL(customSticker.url, { crossOrigin: 'anonymous' }).then((img) => {
      // Scale image to reasonable size
      const maxSize = 150;
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
      toast.success(`${customSticker.name} sticker added! 🎨`);
    }).catch((error) => {
      console.error('Error loading custom sticker:', error);
      toast.error('Failed to load custom sticker');
    });
  };

  const addTextBadge = (badge: { text: string; bg: string; textColor: string }) => {
    if (!canvas) return;

    // Create background rectangle
    const bg = new fabric.Rect({
      left: canvas.width! / 2 - 50,
      top: canvas.height! / 2 - 20,
      width: 100,
      height: 40,
      fill: badge.bg,
      rx: 20,
      ry: 20,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 8,
        offsetX: 0,
        offsetY: 4,
      }),
    });

    // Create text
    const text = new fabric.Text(badge.text, {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontSize: 16,
      fontFamily: 'Arial Black',
      fontWeight: 'bold',
      fill: badge.textColor,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Group them together
    const group = new fabric.Group([bg, text], {
      left: canvas.width! / 2 - 50,
      top: canvas.height! / 2 - 20,
    });

    addObject(group);
    toast.success(`${badge.text} badge added! ✨`);
  };

  const categories = [
    { key: 'custom' as const, label: '🎨 Custom', count: customStickers.length },
    { key: 'badges' as const, label: '🏆 Badges', count: stickers.badges.length },
    { key: 'arrows' as const, label: '➡️ Arrows', count: stickers.arrows.length },
    { key: 'shapes' as const, label: '⭐ Shapes', count: stickers.shapes.length },
    { key: 'emojis' as const, label: '😎 Faces', count: stickers.emojis.length },
  ];

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
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-2xl max-w-3xl w-full h-[500px] mx-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🎭</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Stickers & Badges</h3>
                <p className="text-gray-400 text-xs">Make thumbnails pop!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Categories Sidebar */}
            <div className="w-48 bg-gray-800/50 p-4 border-r border-gray-700/50">
              <h4 className="text-white font-semibold text-sm mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`w-full text-left p-3 rounded-lg transition-all text-sm ${activeCategory === category.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                  >
                    <div className="font-medium">{category.label}</div>
                    <div className="text-xs opacity-70 mt-1">{category.count} items</div>
                  </button>
                ))}
              </div>

              {/* Text Badges Section */}
              <div className="mt-6">
                <h4 className="text-white font-semibold text-sm mb-3">📝 Text Badges</h4>
                <div className="grid grid-cols-1 gap-2">
                  {textBadges.slice(0, 4).map((badge, index) => (
                    <button
                      key={index}
                      onClick={() => addTextBadge(badge)}
                      className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all"
                    >
                      <div
                        className="text-xs font-bold py-1 px-2 rounded text-center"
                        style={{ backgroundColor: badge.bg, color: badge.textColor }}
                      >
                        {badge.text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="mb-4">
                <h4 className="text-white font-semibold text-lg mb-2">
                  {categories.find(c => c.key === activeCategory)?.label}
                </h4>
                <p className="text-gray-400 text-sm">Click any sticker to add it to your canvas</p>
              </div>

              {/* Stickers Grid */}
              <div className="grid grid-cols-6 gap-3 max-h-64 overflow-y-auto">
                {/* Default Stickers */}
                {activeCategory !== 'custom' && stickers[activeCategory].map((sticker, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => addSticker(sticker)}
                    className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 hover:scale-105"
                  >
                    <div
                      className="text-2xl mb-1 group-hover:scale-110 transition-transform"
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      }}
                    >
                      {sticker.emoji}
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity rounded-lg"
                      style={{ background: `linear-gradient(135deg, ${sticker.colors[0]}, ${sticker.colors[1]})` }}
                    />
                  </motion.button>
                ))}

                {/* Custom Stickers */}
                {activeCategory === 'custom' && (
                  loadingCustom ? (
                    <div className="col-span-6 flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        <span>Loading custom stickers...</span>
                      </div>
                    </div>
                  ) : customStickers.length === 0 ? (
                    <div className="col-span-6 flex flex-col items-center justify-center py-8 text-gray-400">
                      <CloudArrowUpIcon className="h-12 w-12 mb-2 opacity-50" />
                      <p className="text-sm mb-1">No custom stickers found</p>
                      <p className="text-xs text-center">
                        Add sticker images to the public/stickers/ folder to see them here
                      </p>
                      <button
                        onClick={fetchCustomStickers}
                        className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-all"
                      >
                        Refresh
                      </button>
                    </div>
                  ) : (
                    customStickers.slice(0, renderCustomCount).map((sticker, index) => (
                      <motion.button
                        key={sticker.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => addCustomSticker(sticker)}
                        className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 hover:scale-105"
                      >
                        <div className="aspect-square mb-1 overflow-hidden rounded">
                          {index < visibleCustomCount ? (
                            <img
                              src={sticker.url}
                              alt={sticker.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="w-full h-full animate-pulse bg-gray-700/70" />
                          )}
                        </div>

                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                      </motion.button>
                    ))
                  )
                )}
              </div>

              {/* More Text Badges */}
              {activeCategory === 'badges' && (
                <div className="mt-4">
                  <h5 className="text-white font-medium mb-2 text-sm">More Text Badges</h5>
                  <div className="grid grid-cols-5 gap-2">
                    {textBadges.slice(4).map((badge, index) => (
                      <button
                        key={index}
                        onClick={() => addTextBadge(badge)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all hover:scale-105"
                      >
                        <div
                          className="text-xs font-bold py-1 px-2 rounded"
                          style={{ backgroundColor: badge.bg, color: badge.textColor }}
                        >
                          {badge.text}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Stickers Section */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h5 className="text-white font-medium mb-2 text-sm">Custom Elements</h5>
                <div className="grid grid-cols-6 gap-2">
                  {/* Quick custom shapes/icons */}
                  {['💥', '⚡', '🔥', '💎', '⭐', '❤️', '👑', '🚀', '💯', '✨', '🎯', '🎉'].map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addSticker({ emoji, label: `Custom ${index + 1}`, colors: ['#ff6b7a', '#c44569'] })}
                      className="bg-gray-800/30 hover:bg-gray-700 p-2 rounded text-xl transition-all hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickersPanel;