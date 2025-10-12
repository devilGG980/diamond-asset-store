import { create } from 'zustand';
import * as fabric from 'fabric';

// Extend fabric Object type to include id
declare module 'fabric' {
  namespace fabric {
    interface Object {
      id?: string;
    }
  }
}

export type FabricObjectWithId = fabric.Object & { id: string };

interface HistoryState {
  canvasState: string;
  timestamp: number;
}

interface EditorState {
  // Canvas
  canvas: fabric.Canvas | null;
  activeObject: FabricObjectWithId | null;
  
  // History (undo/redo)
  history: HistoryState[];
  historyIndex: number;
  
  // Canvas setup
  setCanvas: (canvas: fabric.Canvas) => void;
  
  // Object management
  setActiveObject: (object: FabricObjectWithId | null) => void;
  addObject: (object: fabric.Object) => void;
  removeObject: (object: fabric.Object) => void;
  updateActiveObject: (properties: Partial<fabric.Object>) => void;
  
  // Layer management
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  deleteActiveObject: () => void;
  
  // History management
  saveState: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Clear canvas
  clearCanvas: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  activeObject: null,
  history: [],
  historyIndex: -1,

  setCanvas: (canvas: fabric.Canvas) => {
    set({ canvas });
    
    // Setup event listeners
    canvas.on('selection:created', (e) => {
      const selectedObject = e.selected ? (e.selected[0] as FabricObjectWithId) : null;
      if (selectedObject && !selectedObject.id) {
        selectedObject.set({ id: `object_${Date.now()}` });
      }
      set({ activeObject: selectedObject });
    });

    canvas.on('selection:updated', (e) => {
      const selectedObject = e.selected ? (e.selected[0] as FabricObjectWithId) : null;
      if (selectedObject && !selectedObject.id) {
        selectedObject.set({ id: `object_${Date.now()}` });
      }
      set({ activeObject: selectedObject });
    });

    canvas.on('selection:cleared', () => {
      set({ activeObject: null });
    });

    canvas.on('object:modified', () => {
      get().saveState();
    });

    canvas.on('object:added', () => {
      get().saveState();
    });

    canvas.on('object:removed', () => {
      get().saveState();
    });
  },

  setActiveObject: (object: FabricObjectWithId | null) => {
    set({ activeObject: object });
  },

  addObject: (object: fabric.Object) => {
    const { canvas } = get();
    if (canvas) {
      const objectWithId = object as FabricObjectWithId;
      if (!objectWithId.id) {
        objectWithId.id = `object_${Date.now()}`;
      }
      canvas.add(objectWithId);
      canvas.setActiveObject(objectWithId);
      canvas.renderAll();
    }
  },

  removeObject: (object: fabric.Object) => {
    const { canvas } = get();
    if (canvas) {
      canvas.remove(object);
      canvas.renderAll();
    }
  },

  updateActiveObject: (properties: Partial<fabric.Object>) => {
    const { activeObject, canvas } = get();
    if (activeObject && canvas) {
      activeObject.set(properties);
      canvas.renderAll();
    }
  },

  bringForward: () => {
    const { activeObject, canvas } = get();
    if (activeObject && canvas) {
      canvas.bringObjectForward(activeObject);
      canvas.renderAll();
      get().saveState();
    }
  },

  sendBackward: () => {
    const { activeObject, canvas } = get();
    if (activeObject && canvas) {
      canvas.sendObjectBackwards(activeObject);
      canvas.renderAll();
      get().saveState();
    }
  },

  bringToFront: () => {
    const { activeObject, canvas } = get();
    if (activeObject && canvas) {
      canvas.bringObjectToFront(activeObject);
      canvas.renderAll();
      get().saveState();
    }
  },

  sendToBack: () => {
    const { activeObject, canvas } = get();
    if (activeObject && canvas) {
      canvas.sendObjectToBack(activeObject);
      canvas.renderAll();
      get().saveState();
    }
  },

  deleteActiveObject: () => {
    const { activeObject, canvas } = get();
    if (activeObject && canvas) {
      canvas.remove(activeObject);
      set({ activeObject: null });
      canvas.renderAll();
    }
  },

  saveState: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas) return;

    const canvasState = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      canvasState,
      timestamp: Date.now(),
    });

    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    } else {
      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    }
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const state = history[newIndex];
    
    canvas.loadFromJSON(state.canvasState, () => {
      canvas.renderAll();
      set({ historyIndex: newIndex, activeObject: null });
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const state = history[newIndex];
    
    canvas.loadFromJSON(state.canvasState, () => {
      canvas.renderAll();
      set({ historyIndex: newIndex, activeObject: null });
    });
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  clearCanvas: () => {
    const { canvas } = get();
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
      set({ 
        activeObject: null,
        history: [],
        historyIndex: -1,
      });
    }
  },
}));
