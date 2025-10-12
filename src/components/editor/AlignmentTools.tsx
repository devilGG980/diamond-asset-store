import React from 'react';
import { useEditorStore } from './useEditorStore';
import {
  ArrowsPointingInIcon,
  Bars3BottomLeftIcon,
  Bars3CenterLeftIcon,
  Bars3BottomRightIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AlignmentTools: React.FC = () => {
  const { canvas, activeObject } = useEditorStore();

  const alignLeft = () => {
    if (!canvas || !activeObject) return;
    activeObject.set({ left: 50 });
    canvas.renderAll();
    toast.success('Aligned left');
  };

  const alignCenter = () => {
    if (!canvas || !activeObject) return;
    activeObject.set({ left: (canvas.width! - activeObject.getScaledWidth()) / 2 });
    canvas.renderAll();
    toast.success('Aligned center');
  };

  const alignRight = () => {
    if (!canvas || !activeObject) return;
    activeObject.set({ left: canvas.width! - activeObject.getScaledWidth() - 50 });
    canvas.renderAll();
    toast.success('Aligned right');
  };

  const alignTop = () => {
    if (!canvas || !activeObject) return;
    activeObject.set({ top: 50 });
    canvas.renderAll();
    toast.success('Aligned top');
  };

  const alignMiddle = () => {
    if (!canvas || !activeObject) return;
    activeObject.set({ top: (canvas.height! - activeObject.getScaledHeight()) / 2 });
    canvas.renderAll();
    toast.success('Aligned middle');
  };

  const alignBottom = () => {
    if (!canvas || !activeObject) return;
    activeObject.set({ top: canvas.height! - activeObject.getScaledHeight() - 50 });
    canvas.renderAll();
    toast.success('Aligned bottom');
  };

  const centerCanvas = () => {
    if (!canvas || !activeObject) return;
    activeObject.set({
      left: (canvas.width! - activeObject.getScaledWidth()) / 2,
      top: (canvas.height! - activeObject.getScaledHeight()) / 2,
    });
    canvas.renderAll();
    toast.success('Centered on canvas');
  };

  if (!activeObject) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
      {/* Horizontal Alignment */}
      <div className="flex items-center space-x-1 border-r border-gray-700 pr-1">
        <button
          onClick={alignLeft}
          className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
          title="Align Left"
        >
          <Bars3BottomLeftIcon className="h-4 w-4" />
        </button>
        <button
          onClick={alignCenter}
          className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
          title="Align Center"
        >
          <Bars3CenterLeftIcon className="h-4 w-4" />
        </button>
        <button
          onClick={alignRight}
          className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
          title="Align Right"
        >
          <Bars3BottomRightIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Vertical Alignment */}
      <div className="flex items-center space-x-1 border-r border-gray-700 pr-1">
        <button
          onClick={alignTop}
          className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
          title="Align Top"
        >
          <span className="text-sm font-bold">⬆</span>
        </button>
        <button
          onClick={alignMiddle}
          className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
          title="Align Middle"
        >
          <span className="text-sm font-bold">⬌</span>
        </button>
        <button
          onClick={alignBottom}
          className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
          title="Align Bottom"
        >
          <span className="text-sm font-bold">⬇</span>
        </button>
      </div>

      {/* Center on Canvas */}
      <button
        onClick={centerCanvas}
        className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
        title="Center on Canvas"
      >
        <ArrowsPointingInIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AlignmentTools;
