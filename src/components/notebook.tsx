'use client';

import { useState } from 'react';
import { CodeEditor } from './code-editor';
import { MarkdownEditor } from './markdown-editor';
import { DrawingCanvas } from './drawing-canvas';
import { Button } from './ui/button';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from './ui/select';

type CellType = 'code' | 'markdown' | 'drawing';

interface Cell {
  id: string;
  type: CellType;
  content: string;
  height: number;
}

interface NotebookProps {
  cells: Cell[];
  setCells: (cells: Cell[]) => void;
}

export function Notebook({ cells, setCells }: NotebookProps) {
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);

  const addCell = (type: CellType, index?: number) => {
    const newCell: Cell = {
      id: Math.random().toString(36).substring(7),
      type,
      content: '',
      height: type === 'drawing' ? 400 : 200,
    };
    
    setCells(
      typeof index === 'number'
        ? [...cells.slice(0, index + 1), newCell, ...cells.slice(index + 1)]
        : [...cells, newCell]
    );
  };

  const updateCellContent = (id: string, content: string) => {
    setCells(cells.map((cell) => (cell.id === id ? { ...cell, content } : cell)));
  };

  const updateCellHeight = (id: string, height: number) => {
    setCells(cells.map((cell) => (cell.id === id ? { ...cell, height } : cell)));
  };

  const deleteCell = (id: string) => {
    setCells(cells.filter((cell) => cell.id !== id));
  };

  const moveCell = (id: string, direction: 'up' | 'down') => {
    const index = cells.findIndex((cell) => cell.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === cells.length - 1)
    ) {
      return;
    }

    const newCells = [...cells];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCells[index], newCells[targetIndex]] = [newCells[targetIndex], newCells[index]];
    setCells(newCells);
  };

  const handleResize = (id: string) => (e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    updateCellHeight(id, size.height);
  };

  const renderAddCellButton = (index: number) => (
    <div 
      className="h-2 group/add relative"
      onMouseEnter={() => setHoveredCellId(`add-${index}`)}
      onMouseLeave={() => setHoveredCellId(null)}
    >
      <div className={`
        absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center
        transition-opacity duration-200
        ${hoveredCellId === `add-${index}` ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="bg-white shadow-lg rounded-lg flex items-center">
          <Select
            onValueChange={(value: CellType) => addCell(value, index)}
          >
            <SelectTrigger className="w-[140px] h-8">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add Cell</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="drawing">Drawing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 pb-32">
      {cells.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Select
            onValueChange={(value: CellType) => addCell(value)}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add First Cell</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="drawing">Drawing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-1">
          {cells.map((cell, index) => (
            <div key={cell.id}>
              {index === 0 && renderAddCellButton(-1)}
              <div className="group relative">
                <div className="absolute -left-12 top-0 bottom-0 w-10 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveCell(cell.id, 'up')}
                    className="h-8 w-8"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveCell(cell.id, 'down')}
                    className="h-8 w-8"
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCell(cell.id)}
                    className="h-8 w-8 text-red-500"
                  >
                    ×
                  </Button>
                </div>

                {cell.type === 'code' && (
                  <ResizableBox
                    width={Infinity}
                    height={cell.height}
                    onResize={handleResize(cell.id)}
                    minConstraints={[Infinity, 100]}
                    maxConstraints={[Infinity, 1000]}
                    resizeHandles={['s']}
                    className="w-full relative"
                    handle={
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-transparent hover:bg-zinc-200 cursor-row-resize transition-colors" />
                    }
                  >
                    <div className="h-full border rounded-lg overflow-hidden">
                      <CodeEditor
                        defaultValue={cell.content}
                        onChange={(value) => updateCellContent(cell.id, value || '')}
                        height={cell.height}
                      />
                    </div>
                  </ResizableBox>
                )}

                {cell.type === 'markdown' && (
                  <ResizableBox
                    width={Infinity}
                    height={cell.height}
                    onResize={handleResize(cell.id)}
                    minConstraints={[Infinity, 100]}
                    maxConstraints={[Infinity, 1000]}
                    resizeHandles={['s']}
                    className="w-full relative"
                    handle={
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-transparent hover:bg-zinc-200 cursor-row-resize transition-colors" />
                    }
                  >
                    <div className="h-full border rounded-lg overflow-hidden">
                      <MarkdownEditor
                        defaultValue={cell.content}
                        onChange={(value) => updateCellContent(cell.id, value || '')}
                      />
                    </div>
                  </ResizableBox>
                )}

                {cell.type === 'drawing' && (
                  <DrawingCanvas
                    defaultHeight={cell.height}
                    onHeightChange={(height) => updateCellHeight(cell.id, height)}
                  />
                )}
              </div>
              {renderAddCellButton(index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
