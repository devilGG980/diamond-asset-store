import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from './useEditorStore';

const CanvasStage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvas, saveState } = useEditorStore();

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      // YouTube thumbnail standard size: 1280x720 (scaled down for 100% zoom fit)
      const width = 800;  // Smaller for better 100% zoom fit
      const height = 450; // Maintains 16:9 ratio

      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
      });

      setCanvas(canvas);
      
      // Save initial state
      setTimeout(() => {
        saveState();
      }, 100);

      // Handle window resize to scale canvas view
      const handleResize = () => {
        if (containerRef.current) {
          const container = containerRef.current;
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          
          // Calculate scale to fit at 100% view, use smaller margin on mobile
          const margin = window.innerWidth < 768 ? 16 : 60;
          const scaleX = (containerWidth - margin) / width;
          const scaleY = (containerHeight - margin) / height;
          const scale = Math.min(scaleX, scaleY, 1);
          
          canvas.setZoom(scale);
          canvas.renderAll();
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        canvas.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [setCanvas, saveState]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 h-full w-full flex items-center justify-center bg-gray-100 overflow-auto p-2 sm:p-4 max-w-full"
    >
      <div className="relative" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <canvas ref={canvasRef} className="border-2 border-gray-300" />
      </div>
    </div>
  );
};

export default CanvasStage;