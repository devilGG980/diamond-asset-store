import React from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from './useEditorStore';
import { SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  create: (canvas: fabric.Canvas) => void;
}

const TemplatesPanel: React.FC = () => {
  const { canvas, clearCanvas } = useEditorStore();

  const templates: Template[] = [
    {
      id: 'gaming',
      name: 'Gaming',
      category: 'YouTube',
      preview: '🎮',
      create: (canvas) => {
        // Background
        const bg = new fabric.Rect({
          left: 0,
          top: 0,
          width: canvas.width!,
          height: canvas.height!,
          fill: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          selectable: false,
        });
        canvas.add(bg);

        // Title Text
        const title = new fabric.IText('EPIC GAMEPLAY', {
          left: 100,
          top: 250,
          fontSize: 90,
          fontFamily: 'Bebas Neue',
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 4,
          fontWeight: 'bold',
          shadow: new fabric.Shadow({
            color: '#ff0080',
            blur: 20,
            offsetX: 5,
            offsetY: 5,
          }),
        });
        canvas.add(title);

        // Emoji
        const emoji = new fabric.IText('🎮', {
          left: 900,
          top: 150,
          fontSize: 200,
        });
        canvas.add(emoji);
      },
    },
    {
      id: 'tutorial',
      name: 'Tutorial',
      category: 'YouTube',
      preview: '📚',
      create: (canvas) => {
        // Background
        const bg = new fabric.Rect({
          left: 0,
          top: 0,
          width: canvas.width!,
          height: canvas.height!,
          fill: '#1a1a2e',
          selectable: false,
        });
        canvas.add(bg);

        // Accent Shape
        const accent = new fabric.Circle({
          left: 800,
          top: -100,
          radius: 300,
          fill: '#0f4c81',
          selectable: false,
        });
        canvas.add(accent);

        // Title
        const title = new fabric.IText('HOW TO', {
          left: 100,
          top: 150,
          fontSize: 80,
          fontFamily: 'Poppins',
          fill: '#ffffff',
          fontWeight: 'bold',
        });
        canvas.add(title);

        // Subtitle
        const subtitle = new fabric.IText('Step by Step Guide', {
          left: 100,
          top: 250,
          fontSize: 45,
          fontFamily: 'Poppins',
          fill: '#ffd700',
        });
        canvas.add(subtitle);
      },
    },
    {
      id: 'vlog',
      name: 'Vlog',
      category: 'YouTube',
      preview: '📹',
      create: (canvas) => {
        // Gradient Background
        const bg = new fabric.Rect({
          left: 0,
          top: 0,
          width: canvas.width!,
          height: canvas.height!,
          fill: '#ff6b6b',
          selectable: false,
        });
        canvas.add(bg);

        // Text Banner
        const banner = new fabric.Rect({
          left: 0,
          top: 250,
          width: canvas.width!,
          height: 220,
          fill: 'rgba(0, 0, 0, 0.7)',
          selectable: false,
        });
        canvas.add(banner);

        // Title
        const title = new fabric.IText('MY DAY', {
          left: canvas.width! / 2 - 150,
          top: 300,
          fontSize: 100,
          fontFamily: 'Permanent Marker',
          fill: '#ffffff',
          fontWeight: 'bold',
        });
        canvas.add(title);

        // Emojis
        const emoji1 = new fabric.IText('✨', {
          left: 150,
          top: 100,
          fontSize: 100,
        });
        canvas.add(emoji1);

        const emoji2 = new fabric.IText('🔥', {
          left: 1000,
          top: 500,
          fontSize: 100,
        });
        canvas.add(emoji2);
      },
    },
    {
      id: 'news',
      name: 'News/Update',
      category: 'YouTube',
      preview: '📰',
      create: (canvas) => {
        // Background
        const bg = new fabric.Rect({
          left: 0,
          top: 0,
          width: canvas.width!,
          height: canvas.height!,
          fill: '#2d3436',
          selectable: false,
        });
        canvas.add(bg);

        // Red Banner
        const banner = new fabric.Rect({
          left: 0,
          top: 0,
          width: canvas.width!,
          height: 150,
          fill: '#e74c3c',
          selectable: false,
        });
        canvas.add(banner);

        // Breaking Label
        const breaking = new fabric.IText('BREAKING', {
          left: 50,
          top: 40,
          fontSize: 60,
          fontFamily: 'Arial Black',
          fill: '#ffffff',
          fontWeight: 'bold',
        });
        canvas.add(breaking);

        // Main Title
        const title = new fabric.IText('BIG NEWS!', {
          left: 100,
          top: 300,
          fontSize: 90,
          fontFamily: 'Montserrat',
          fill: '#ffffff',
          fontWeight: 'bold',
        });
        canvas.add(title);
      },
    },
    {
      id: 'minimal',
      name: 'Minimal',
      category: 'YouTube',
      preview: '⚪',
      create: (canvas) => {
        // White Background
        const bg = new fabric.Rect({
          left: 0,
          top: 0,
          width: canvas.width!,
          height: canvas.height!,
          fill: '#ffffff',
          selectable: false,
        });
        canvas.add(bg);

        // Title
        const title = new fabric.IText('YOUR TITLE', {
          left: canvas.width! / 2 - 250,
          top: canvas.height! / 2 - 60,
          fontSize: 80,
          fontFamily: 'Montserrat',
          fill: '#000000',
          fontWeight: 'bold',
        });
        canvas.add(title);

        // Accent Line
        const line = new fabric.Rect({
          left: canvas.width! / 2 - 250,
          top: canvas.height! / 2 + 60,
          width: 500,
          height: 5,
          fill: '#000000',
          selectable: false,
        });
        canvas.add(line);
      },
    },
    {
      id: 'energetic',
      name: 'Energetic',
      category: 'YouTube',
      preview: '⚡',
      create: (canvas) => {
        // Gradient Background
        const bg = new fabric.Rect({
          left: 0,
          top: 0,
          width: canvas.width!,
          height: canvas.height!,
          fill: '#f093fb',
          selectable: false,
        });
        canvas.add(bg);

        // Diagonal Stripes
        for (let i = 0; i < 5; i++) {
          const stripe = new fabric.Rect({
            left: i * 300 - 200,
            top: -100,
            width: 150,
            height: canvas.height! + 200,
            fill: 'rgba(255, 255, 255, 0.1)',
            angle: 15,
            selectable: false,
          });
          canvas.add(stripe);
        }

        // Title
        const title = new fabric.IText('AMAZING!', {
          left: 150,
          top: 250,
          fontSize: 120,
          fontFamily: 'Bangers',
          fill: '#ffffff',
          stroke: '#ff0080',
          strokeWidth: 5,
          shadow: new fabric.Shadow({
            color: '#000000',
            blur: 15,
            offsetX: 5,
            offsetY: 5,
          }),
        });
        canvas.add(title);

        // Emoji
        const emoji = new fabric.IText('⚡', {
          left: 900,
          top: 200,
          fontSize: 180,
        });
        canvas.add(emoji);
      },
    },
  ];

  const applyTemplate = (template: Template) => {
    if (!canvas) return;

    if (window.confirm(`Apply "${template.name}" template? This will clear your current design.`)) {
      clearCanvas();
      template.create(canvas);
      canvas.renderAll();
      toast.success(`${template.name} template applied!`);
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-white font-semibold mb-3 flex items-center">
        <SparklesIcon className="h-5 w-5 mr-2" />
        Quick Templates
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => applyTemplate(template)}
            className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-left"
          >
            <div className="text-3xl mb-2">{template.preview}</div>
            <div className="text-white text-sm font-medium">{template.name}</div>
            <div className="text-gray-400 text-xs">{template.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPanel;
