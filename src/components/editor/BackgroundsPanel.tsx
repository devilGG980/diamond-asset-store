import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEditorStore } from './useEditorStore';
import * as fabric from 'fabric';
import toast from 'react-hot-toast';

interface BackgroundsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const BackgroundsPanel: React.FC<BackgroundsPanelProps> = ({ isOpen, onClose }) => {
  const { canvas } = useEditorStore();
  type TabKey = 'gradients' | 'colors' | 'patterns' | 'templates' | 'custom';
  const [activeTab, setActiveTab] = useState<TabKey>('custom');
  const [customItems, setCustomItems] = useState<Array<{ name: string; url: string }>>([]);
  const [customLoaded, setCustomLoaded] = useState(false);
  // Progressive (sequential) loader for custom background thumbnails
  const [visibleBgCount, setVisibleBgCount] = useState(0);
  const [renderBgCount, setRenderBgCount] = useState(0);

  // Gradient backgrounds
  const gradients = [
    { name: 'Sunset', colors: ['#ff9a56', '#ff6b95'], direction: 'linear' },
    { name: 'Ocean', colors: ['#667eea', '#764ba2'], direction: 'linear' },
    { name: 'Purple Dream', colors: ['#a8edea', '#fed6e3'], direction: 'linear' },
    { name: 'Green Mint', colors: ['#d299c2', '#fef9d7'], direction: 'linear' },
    { name: 'Blue Sky', colors: ['#89f7fe', '#66a6ff'], direction: 'linear' },
    { name: 'Fire', colors: ['#fa709a', '#fee140'], direction: 'linear' },
    { name: 'Night', colors: ['#2d3748', '#4a5568'], direction: 'linear' },
    { name: 'Rainbow', colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'], direction: 'linear' },
    { name: 'Gold', colors: ['#f7931e', '#ffd200'], direction: 'linear' },
    { name: 'Dark Blue', colors: ['#1e3c72', '#2a5298'], direction: 'linear' },
    { name: 'Pink Glow', colors: ['#ff9a9e', '#fecfef'], direction: 'linear' },
    { name: 'Green Wave', colors: ['#56ab2f', '#a8e6cf'], direction: 'linear' },
  ];

  // Solid colors
  const solidColors = [
    { name: 'YouTube Red', color: '#ff0000' },
    { name: 'Pure White', color: '#ffffff' },
    { name: 'Deep Black', color: '#000000' },
    { name: 'Blue', color: '#007bff' },
    { name: 'Green', color: '#28a745' },
    { name: 'Orange', color: '#fd7e14' },
    { name: 'Purple', color: '#6f42c1' },
    { name: 'Pink', color: '#e83e8c' },
    { name: 'Yellow', color: '#ffc107' },
    { name: 'Teal', color: '#20c997' },
    { name: 'Gray', color: '#6c757d' },
    { name: 'Dark', color: '#343a40' },
  ];

  // Pattern backgrounds
  const patterns = [
    { name: 'Dots', pattern: 'dots' },
    { name: 'Lines', pattern: 'lines' },
    { name: 'Grid', pattern: 'grid' },
    { name: 'Diagonal', pattern: 'diagonal' },
    { name: 'Waves', pattern: 'waves' },
    { name: 'Hexagon', pattern: 'hexagon' },
  ];

  // Template backgrounds (YouTube-style thumbnails)
  const templates = [
    { name: 'Gaming', bg: '#1a1a2e', accent: '#16213e', text: '#e94560' },
    { name: 'Tech', bg: '#0f3460', accent: '#16537e', text: '#00d4ff' },
    { name: 'Food', bg: '#ff6b35', accent: '#f29d35', text: '#ffffff' },
    { name: 'Fitness', bg: '#2d4a22', accent: '#90a955', text: '#ecf87f' },
    { name: 'Education', bg: '#2c5aa0', accent: '#a2d5f2', text: '#ffffff' },
    { name: 'Music', bg: '#7209b7', accent: '#f72585', text: '#ffffff' },
    { name: 'Travel', bg: '#264653', accent: '#2a9d8f', text: '#e9c46a' },
    { name: 'Business', bg: '#1d3557', accent: '#457b9d', text: '#f1faee' },
  ];

  const applyGradient = (gradient: typeof gradients[0]) => {
    if (!canvas) return;

    try {
      const fabricGradient = new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 0,
          y1: 0,
          x2: canvas.width!,
          y2: canvas.height!,
        },
        colorStops: gradient.colors.map((color, index) => ({
          offset: index / (gradient.colors.length - 1),
          color: color,
        })),
      });

      const backgroundRect = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas.width!,
        height: canvas.height!,
        fill: fabricGradient,
        selectable: true,
        evented: true,
        excludeFromExport: false,
        name: 'background',
      });

      // Remove existing background
      const objects = canvas.getObjects();
      const existingBg = objects.find(obj => (obj as any).name === 'background');
      if (existingBg) {
        canvas.remove(existingBg);
      }

      canvas.add(backgroundRect);
      canvas.sendObjectToBack(backgroundRect);
      canvas.renderAll();
      toast.success(`${gradient.name} gradient applied! ✨`);
    } catch (error) {
      console.error('Gradient error:', error);
      toast.error('Failed to apply gradient');
    }
  };

  const applySolidColor = (colorObj: typeof solidColors[0]) => {
    if (!canvas) return;

    const backgroundRect = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.width!,
      height: canvas.height!,
      fill: colorObj.color,
      selectable: true,
      evented: true,
      excludeFromExport: false,
      name: 'background',
    });

    // Remove existing background
    const objects = canvas.getObjects();
    const existingBg = objects.find(obj => (obj as any).name === 'background');
    if (existingBg) {
      canvas.remove(existingBg);
    }

    canvas.add(backgroundRect);
    canvas.sendObjectToBack(backgroundRect);
    canvas.renderAll();
    toast.success(`${colorObj.name} background applied! 🎨`);
  };

  const applyPattern = (patternObj: typeof patterns[0]) => {
    if (!canvas) return;

    try {
      // Create pattern canvas
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 40;
      patternCanvas.height = 40;
      const ctx = patternCanvas.getContext('2d');

      if (!ctx) return;

      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, 40, 40);
      ctx.strokeStyle = '#dee2e6';
      ctx.lineWidth = 1;

      switch (patternObj.pattern) {
        case 'dots':
          ctx.fillStyle = '#6c757d';
          ctx.beginPath();
          ctx.arc(20, 20, 3, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'lines':
          ctx.beginPath();
          ctx.moveTo(0, 20);
          ctx.lineTo(40, 20);
          ctx.stroke();
          break;

        case 'grid':
          ctx.beginPath();
          ctx.moveTo(0, 20);
          ctx.lineTo(40, 20);
          ctx.moveTo(20, 0);
          ctx.lineTo(20, 40);
          ctx.stroke();
          break;

        case 'diagonal':
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(40, 40);
          ctx.moveTo(0, 40);
          ctx.lineTo(40, 0);
          ctx.stroke();
          break;

        case 'waves':
          ctx.beginPath();
          ctx.moveTo(0, 20);
          ctx.quadraticCurveTo(10, 10, 20, 20);
          ctx.quadraticCurveTo(30, 30, 40, 20);
          ctx.stroke();
          break;

        case 'hexagon':
          ctx.beginPath();
          const centerX = 20, centerY = 20, radius = 8;
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          break;
      }

      // Create pattern
      const pattern = new fabric.Pattern({
        source: patternCanvas,
        repeat: 'repeat',
      });

      const backgroundRect = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas.width!,
        height: canvas.height!,
        fill: pattern,
        selectable: true,
        evented: true,
        excludeFromExport: false,
        name: 'background',
      });

      // Remove existing background
      const objects = canvas.getObjects();
      const existingBg = objects.find(obj => (obj as any).name === 'background');
      if (existingBg) {
        canvas.remove(existingBg);
      }

      canvas.add(backgroundRect);
      canvas.sendObjectToBack(backgroundRect);
      canvas.renderAll();
      toast.success(`${patternObj.name} pattern applied! 📐`);
    } catch (error) {
      console.error('Pattern error:', error);
      toast.error('Failed to apply pattern');
    }
  };

  const applyTemplate = (template: typeof templates[0]) => {
    if (!canvas) return;

    // Create gradient background with template colors
    const fabricGradient = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: 0,
        y1: 0,
        x2: canvas.width!,
        y2: canvas.height!,
      },
      colorStops: [
        { offset: 0, color: template.bg },
        { offset: 0.7, color: template.accent },
        { offset: 1, color: template.bg },
      ],
    });

    const backgroundRect = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.width!,
      height: canvas.height!,
      fill: fabricGradient,
      selectable: true,
      evented: true,
      excludeFromExport: false,
      name: 'background',
    });

    // Remove existing background
    const objects = canvas.getObjects();
    const existingBg = objects.find(obj => (obj as any).name === 'background');
    if (existingBg) {
      canvas.remove(existingBg);
    }

    canvas.add(backgroundRect);
    canvas.sendObjectToBack(backgroundRect);
    canvas.renderAll();
    toast.success(`${template.name} template applied! 🎬`);
  };

  const removeBackground = () => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    const existingBg = objects.find(obj => (obj as any).name === 'background');
    if (existingBg) {
      canvas.remove(existingBg);
      canvas.renderAll();
      toast.success('Background removed! 🗑️');
    } else {
      toast('No background to remove', { icon: 'ℹ️' });
    }
  };

  const tabs: Array<{ key: TabKey; label: string; count: number }> = [
    { key: 'gradients', label: '🌈 Gradients', count: gradients.length },
    { key: 'colors', label: '🎨 Colors', count: solidColors.length },
    { key: 'patterns', label: '📐 Patterns', count: patterns.length },
    { key: 'templates', label: '🎬 Templates', count: templates.length },
    { key: 'custom', label: '📂 Custom', count: customItems.length },
  ];

  useEffect(() => {
    if (isOpen && activeTab === 'custom' && !customLoaded) {
      const load = async () => {
        try {
          const CDN_BASE = 'https://cdn.jsdelivr.net/gh/devilGG980/diamond-asset-store@main/public';
          // Stickers-style loader
          const res = await fetch(`${CDN_BASE}/backgrounds/index.json`, { cache: 'no-store' });
          if (res.ok) {
            const arr: string[] = await res.json();
            setCustomItems(arr.map((name) => {
              const decoded = decodeURIComponent(name);
              const base = decoded.replace(/\.[^.]+$/, '');
              const display = base || name;
              return { name: display, url: `${CDN_BASE}/backgrounds/${encodeURIComponent(name)}` };
            }));
          } else {
            // Quiet fallback to manifest if present (also via CDN if possible, but index.json is preferred)
            const res2 = await fetch(`${CDN_BASE}/backgrounds.json`, { cache: 'no-store' });
            if (res2.ok) {
              const data = await res2.json();
              setCustomItems((data?.items || []).map((it: any) => {
                const fname = it.name || it.url.split('/').pop() || '';
                const decoded = decodeURIComponent(fname);
                const base = decoded.replace(/\.[^.]+$/, '');
                const display = base || fname;
                // handle both relative and absolute paths if needed, but here we assume relative to CDN base
                const urlPath = it.url.startsWith('/') ? it.url.substring(1) : it.url;
                return { name: display, url: `${CDN_BASE}/${urlPath}` };
              }));
            } else {
              setCustomItems([]);
            }
          }
        } finally {
          setCustomLoaded(true);
        }
      };
      load();
    }
  }, [isOpen, activeTab, customLoaded]);

  // Sequentially preload background thumbnails for the custom tab (batched)
  useEffect(() => {
    if (!isOpen || activeTab !== 'custom' || customItems.length === 0) return;
    let cancelled = false;
    const urls = customItems.map(i => i.url);
    const INITIAL = Math.min(24, urls.length);
    setVisibleBgCount(INITIAL);
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
          setVisibleBgCount(i + 1);
          loadedInBatch = 0;
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen, activeTab, customItems]);

  // Progressive render for custom backgrounds to reduce mount cost
  useEffect(() => {
    if (!isOpen || activeTab !== 'custom') return;
    let cancelled = false;
    const total = customItems.length;
    const STEP = 64;
    setRenderBgCount(Math.min(STEP, total));
    const schedule = () => {
      if (cancelled) return;
      setRenderBgCount((prev) => {
        if (prev >= total) return prev;
        const next = Math.min(prev + STEP, total);
        if (!cancelled) queueMicrotask(schedule);
        return next;
      });
    };
    requestAnimationFrame(() => schedule());
    return () => { cancelled = true; };
  }, [isOpen, activeTab, customItems]);

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
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 shadow-2xl max-w-4xl w-full h-[500px] mx-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🌅</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Backgrounds</h3>
                <p className="text-gray-400 text-xs">Choose the perfect background</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Tabs Sidebar */}
            <div className="w-40 bg-gray-800/50 p-3 border-r border-gray-700/50">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full text-left p-2 rounded-lg transition-all text-xs ${activeTab === tab.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                  >
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-70 mt-1">{tab.count} options</div>
                  </button>
                ))}
              </div>

              {/* Remove Background Button */}
              <div className="mt-4 pt-3 border-t border-gray-700">
                <button
                  onClick={removeBackground}
                  className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-xs font-medium transition-all"
                >
                  🗑️ Remove BG
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="mb-3">
                <h4 className="text-white font-semibold text-base">
                  {tabs.find(t => t.key === activeTab)?.label}
                </h4>
                <p className="text-gray-400 text-xs">Click any option to apply</p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {/* Custom */}
                {activeTab === 'custom' && (
                  <div>
                    <div className="grid grid-cols-4 gap-3">
                      {customItems.slice(0, renderBgCount).map((u, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!canvas) return;
                            fabric.Image.fromURL(u.url, { crossOrigin: 'anonymous' }).then((img) => {
                              const w = img.width || 1; const h = img.height || 1;
                              // Cover scaling to preserve aspect ratio (no stretching)
                              const scale = Math.max(canvas.width! / w, canvas.height! / h);
                              const scaledW = w * scale; const scaledH = h * scale;
                              const left = (canvas.width! - scaledW) / 2;
                              const top = (canvas.height! - scaledH) / 2;
                              img.set({ left, top, scaleX: scale, scaleY: scale, selectable: true, evented: true });
                              (img as any).name = 'background';
                              const existing = canvas.getObjects().find(o => (o as any).name === 'background');
                              if (existing) canvas.remove(existing);
                              canvas.add(img); canvas.sendObjectToBack(img); canvas.renderAll();
                              toast.success(`${u.name} applied as background`);
                            }).catch(() => toast.error('Failed to load image'));
                          }}
                          className="relative rounded overflow-hidden border border-gray-700 hover:border-white/60 transition"
                        >
                          {idx < visibleBgCount ? (
                            <img src={u.url} alt={u.name} className="w-full h-16 object-cover" loading="lazy" decoding="async" />
                          ) : (
                            <div className="w-full h-16 animate-pulse bg-gray-700/70" />
                          )}
                        </button>
                      ))}
                      {customLoaded && customItems.length === 0 && (
                        <div className="col-span-4 text-xs text-gray-400">No custom backgrounds found.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Gradients */}
                {activeTab === 'gradients' && (
                  <div className="grid grid-cols-4 gap-3">
                    {gradients.map((gradient, index) => (
                      <button
                        key={index}
                        onClick={() => applyGradient(gradient)}
                        className="group relative h-20 rounded-lg overflow-hidden border border-gray-600 hover:border-white transition-all hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${gradient.colors.join(', ')})`
                        }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                        <div className="absolute bottom-1 left-1 text-white text-xs font-medium bg-black/50 px-1 rounded">
                          {gradient.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Solid Colors */}
                {activeTab === 'colors' && (
                  <div className="grid grid-cols-6 gap-3">
                    {solidColors.map((colorObj, index) => (
                      <button
                        key={index}
                        onClick={() => applySolidColor(colorObj)}
                        className="group relative h-16 rounded-lg border-2 border-gray-600 hover:border-white transition-all hover:scale-105"
                        style={{ backgroundColor: colorObj.color }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-md" />
                        <div className="absolute bottom-1 inset-x-1 text-center">
                          <div
                            className="text-xs font-medium px-1 rounded"
                            style={{
                              color: colorObj.color === '#ffffff' ? '#000000' : '#ffffff',
                              backgroundColor: colorObj.color === '#ffffff' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.2)'
                            }}
                          >
                            {colorObj.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Patterns */}
                {activeTab === 'patterns' && (
                  <div className="grid grid-cols-3 gap-4">
                    {patterns.map((pattern, index) => (
                      <button
                        key={index}
                        onClick={() => applyPattern(pattern)}
                        className="group bg-gray-800/50 hover:bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-all hover:scale-105"
                      >
                        <div className="text-2xl mb-2">📐</div>
                        <div className="text-gray-300 text-sm font-medium">{pattern.name}</div>
                        <div className="text-gray-500 text-xs mt-1">Pattern</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Templates */}
                {activeTab === 'templates' && (
                  <div className="grid grid-cols-4 gap-3">
                    {templates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => applyTemplate(template)}
                        className="group relative h-20 rounded-lg overflow-hidden border border-gray-600 hover:border-white transition-all hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${template.bg} 0%, ${template.accent} 70%, ${template.bg} 100%)`
                        }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                        <div className="absolute bottom-1 left-1 text-xs font-medium px-1 rounded"
                          style={{ color: template.text, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                          {template.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BackgroundsPanel;