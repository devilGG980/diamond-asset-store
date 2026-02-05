import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { motion } from 'framer-motion';


import { useLocation } from 'react-router-dom';
import PageSEO from '../SEO/PageSEO';

interface Point { x: number; y: number; }

const PenCropEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [imageObj, setImageObj] = useState<fabric.Image | null>(null);
  const location = useLocation();
  const [isPenMode, setIsPenMode] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [mode, setMode] = useState<'none' | 'rect'>('rect');
  const [layer, setLayer] = useState<'image' | 'mask'>('image');


  // Rectangle crop state
  const [cropRect, setCropRect] = useState<fabric.Rect | null>(null);
  const rectStartRef = useRef<Point | null>(null);
  const isDraggingRef = useRef(false);

  // Init fabric canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      width: 900,
      height: 600,
      backgroundColor: 'rgba(0,0,0,0)'
    });
    // Improve performance
    c.preserveObjectStacking = true;
    setCanvas(c);

    const onResize = () => {
      if (!containerRef.current) return;
      const w = Math.min(1200, containerRef.current.clientWidth);
      const h = Math.round((w * 2) / 3);
      c.setDimensions({ width: w, height: h });
      c.calcOffset();
      c.renderAll();
    };
    onResize();
    window.addEventListener('resize', onResize);

    const onScroll = () => c.calcOffset();
    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
      c.dispose();
    };
  }, []);

  // Common add-to-canvas
  const addImageToCanvas = async (img: fabric.Image) => {
    if (!canvas) return;
    const maxW = canvas.getWidth()! * 0.9;
    const maxH = canvas.getHeight()! * 0.9;
    const scale = Math.min(maxW / (img.width || 1), maxH / (img.height || 1), 1);
    img.scale(scale);
    img.set({
      left: (canvas.getWidth()! - img.getScaledWidth()) / 2,
      top: (canvas.getHeight()! - img.getScaledHeight()) / 2,
      selectable: true,
      evented: true,
    });
    canvas.clear();
    canvas.add(img);
    canvas.setActiveObject(img);
    setImageObj(img);
    if (cropRect) { canvas.remove(cropRect); setCropRect(null); }
    setMode('rect');
    setLayer('mask');
    canvas.requestRenderAll();
  };

  // Upload handler (kept internally but no visible button)
  const handleUpload = (file: File) => {
    if (!canvas) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const url = e.target?.result as string;
      const img = await fabric.Image.fromURL(url);
      await addImageToCanvas(img);
    };
    reader.readAsDataURL(file);
  };

  // Load from URL (query param) with CORS
  const handleLoadFromUrl = async (url: string) => {
    if (!canvas) return;
    const img = await fabric.Image.fromURL(url, { crossOrigin: 'anonymous' } as any);
    await addImageToCanvas(img);
  };

  // Apply crop using the rectangle mask
  const applyCrop = useCallback(async () => {
    if (!canvas || !imageObj || !cropRect) return;
    setIsApplying(true);
    try {
      const clip = new fabric.Rect({
        left: cropRect.left,
        top: cropRect.top,
        width: cropRect.width,
        height: cropRect.height,
        scaleX: cropRect.scaleX,
        scaleY: cropRect.scaleY,
        angle: cropRect.angle,
        originX: cropRect.originX,
        originY: cropRect.originY,
      } as any);
      (clip as any).absolutePositioned = true;
      imageObj.clipPath = clip as unknown as fabric.Object;
      canvas.requestRenderAll();
    } finally {
      setIsApplying(false);
    }
  }, [canvas, imageObj, cropRect]);

  // No anchors or polygon logic for rectangle mode

  // Initial load: from ?src= or show drop/paste support
  useEffect(() => {
    if (!canvas) return;
    const params = new URLSearchParams(location.search);
    const src = params.get('src');
    if (src) {
      handleLoadFromUrl(src).catch(() => {/* no-op */ });
    }

    // Drag & drop support
    const container = containerRef.current;
    if (container) {
      const onDragOver = (e: DragEvent) => { e.preventDefault(); };
      const onDrop = (e: DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) handleUpload(file);
      };
      const onContextMenu = (e: Event) => { e.preventDefault(); };
      container.addEventListener('dragover', onDragOver);
      container.addEventListener('drop', onDrop);
      container.addEventListener('contextmenu', onContextMenu);
      return () => {
        container.removeEventListener('dragover', onDragOver);
        container.removeEventListener('drop', onDrop);
        container.removeEventListener('contextmenu', onContextMenu);
      };
    }
  }, [canvas, location.search]);

  useEffect(() => {
    if (!canvas) return;

    const onMouseDown = (opt: fabric.TPointerEventInfo) => {
      const ev = opt.e as MouseEvent;
      if (ev.button !== 0) return; // only left click
      const p = canvas.getPointer(opt.e);
      if (mode === 'rect') {
        // If clicking existing rect/handles, let Fabric handle resize/move
        if (cropRect && (opt.target === cropRect)) {
          canvas.selection = false;
          canvas.skipTargetFind = false; // allow control detection
          return;
        }
        // Start a new rectangle selection
        canvas.discardActiveObject();
        canvas.selection = false;
        canvas.skipTargetFind = true; // ignore objects while dragging new rect
        rectStartRef.current = { x: p.x, y: p.y };
        isDraggingRef.current = true;
        if (cropRect) { canvas.remove(cropRect); setCropRect(null); }
        const r = new fabric.Rect({
          left: p.x,
          top: p.y,
          width: 1,
          height: 1,
          fill: 'rgba(34,211,238,0.12)',
          stroke: '#22d3ee',
          strokeWidth: 2,
          selectable: false,
          evented: false,
          objectCaching: false,
        } as any);
        canvas.add(r);
        setCropRect(r);
      }
    };

    const onMouseMove = (opt: fabric.TPointerEventInfo) => {
      if (mode === 'rect' && isDraggingRef.current && cropRect && rectStartRef.current) {
        const p = canvas.getPointer(opt.e);
        const sx = Math.min(p.x, rectStartRef.current.x);
        const sy = Math.min(p.y, rectStartRef.current.y);
        const ex = Math.max(p.x, rectStartRef.current.x);
        const ey = Math.max(p.y, rectStartRef.current.y);
        cropRect.set({ left: sx, top: sy, width: ex - sx, height: ey - sy });
        canvas.requestRenderAll();
      }
    };

    const onMouseUp = () => {
      if (mode === 'rect') {
        // Finish drag if we were creating one
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          if (cropRect) {
            cropRect.set({
              selectable: true,
              evented: true,
              hasControls: true,
              hasBorders: true,
              lockRotation: true,
              transparentCorners: false,
              cornerColor: '#22d3ee',
              borderColor: '#22d3ee',
              cornerSize: 10
            } as any);
            canvas.setActiveObject(cropRect);
          }
        }
        canvas.selection = false; // keep selection off to avoid dragging canvas
        canvas.skipTargetFind = false; // allow interacting with rect handles
        canvas.requestRenderAll();
      }
    };

    const onMouseUpWindow = () => onMouseUp();

    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);
    window.addEventListener('mouseup', onMouseUpWindow);
    return () => {
      canvas.off('mouse:down', onMouseDown);
      canvas.off('mouse:move', onMouseMove);
      canvas.off('mouse:up', onMouseUp);
      window.removeEventListener('mouseup', onMouseUpWindow);
    };
  }, [canvas, mode, cropRect]);

  // Toggle selectability
  useEffect(() => {
    if (!canvas) return;
    if (imageObj) {
      imageObj.selectable = false; // keep image fixed while working
      imageObj.evented = false;
    }
    if (cropRect) {
      cropRect.selectable = true;
      cropRect.evented = true;
    }
    canvas.requestRenderAll();
  }, [canvas, imageObj, cropRect]);

  const handleUndo = () => {
    if (!canvas) return;
    if (cropRect) {
      canvas.remove(cropRect);
      setCropRect(null);
      canvas.requestRenderAll();
    }
  };

  const handleRedo = () => {
    // no-op for rectangle mode
  };


  const downloadPng = async () => {
    if (!canvas || !imageObj) return;
    // If we have a clipPath, crop export to its bounds
    const area = (imageObj.clipPath as any) as fabric.Object | undefined;
    let dataUrl: string;
    if (area) {
      const rect = area.getBoundingRect();
      dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        enableRetinaScaling: false,
        withoutTransform: true,
      } as any);
    } else {
      dataUrl = canvas.toDataURL({ format: 'png', quality: 1 } as any);
    }

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `pen-crop-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <PageSEO
        title="Image Pen Crop Tool - EditorVault"
        description="Free online tool to crop images with rectangular selection or pen tool."
        keywords={['image cropper', 'pen tool', 'online photo editor', 'free crop tool']}
      />
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-900/80 border border-gray-800 rounded-xl p-3 sticky top-4 z-10">
          {/* Modes */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('rect')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'rect' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
            >▭ Rectangle</button>
            <button
              onClick={() => setMode('none')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'none' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
            >🖱️ Move</button>
          </div>

          {/* Layer selector */}
          <div className="ml-2">
            <select
              value={layer}
              onChange={(e) => setLayer(e.target.value as any)}
              className="bg-gray-800 text-gray-200 border border-gray-700 rounded px-2 py-2 text-sm"
            >
              <option value="image">Image</option>
              <option value="mask">Mask</option>
            </select>
          </div>

          {/* Utilities */}
          <button onClick={handleUndo} className="px-3 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700">↶ Clear Rect</button>

          {/* Actions */}
          <button onClick={applyCrop} disabled={!imageObj || !cropRect || isApplying} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50">
            {isApplying ? 'Applying…' : 'Apply Crop'}
          </button>
          <button onClick={downloadPng} disabled={!imageObj} className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold disabled:opacity-50">⬇️ Download</button>


          <div className="ml-auto text-xs text-gray-400">
            Tips: Drag to draw a rectangle. Resize/move it if needed, then Apply Crop.
          </div>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="relative bg-gray-900/60 border border-gray-800 rounded-xl p-2 min-h-[300px]">
          {!imageObj && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400 text-sm">
                <div className="mb-2">Drag & drop an image here or paste (Ctrl+V)</div>
                <div className="opacity-70">Or open with /pen-crop?src=IMAGE_URL</div>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>
      </div>
    </div>
  );
};

export default PenCropEditor;
