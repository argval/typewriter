'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { SketchPicker, ColorResult } from 'react-color';
import * as Popover from '@radix-ui/react-popover';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface Point {
  x: number;
  y: number;
  pressure: number;
}

interface DrawingCanvasProps {
  defaultHeight?: number;
  onHeightChange?: (height: number) => void;
}

export function DrawingCanvas({ defaultHeight = 400, onHeightChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [isEraser, setIsEraser] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPoint = useRef<Point | null>(null);
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    setHeight(defaultHeight);
  }, [defaultHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    
    // Set the canvas's coordinate space to a fixed large size
    canvas.width = rect.width;
    canvas.height = 3000; // Make it really tall

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const drawLine = (start: Point, end: Point) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    
    if (isEraser) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * start.pressure;
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollTop = e.currentTarget.parentElement?.scrollTop || 0;
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top + scrollTop,
      pressure: e.pressure || 0.5,
    };
    lastPoint.current = point;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !lastPoint.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const scrollTop = e.currentTarget.parentElement?.scrollTop || 0;
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top + scrollTop,
      pressure: e.pressure || 0.5,
    };

    drawLine(lastPoint.current, currentPoint);
    lastPoint.current = currentPoint;
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleResize = (e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    setHeight(size.height);
    onHeightChange?.(size.height);
  };

  return (
    <ResizableBox
      width={Infinity}
      height={height}
      onResize={handleResize}
      minConstraints={[Infinity, 200]}
      maxConstraints={[Infinity, 1000]}
      resizeHandles={['s']}
      className="relative"
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b p-2 flex items-center gap-2">
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button variant="outline" className="w-8 h-8 p-0" style={{ backgroundColor: color }}>
                <span className="sr-only">Pick color</span>
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="z-50" sideOffset={5}>
                <SketchPicker color={color} onChange={(color: ColorResult) => setColor(color.hex)} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <div className="flex items-center gap-2">
            <span className="text-sm">Size:</span>
            <Slider
              value={[brushSize]}
              onValueChange={([size]) => setBrushSize(size)}
              min={1}
              max={20}
              step={1}
              className="w-24"
            />
          </div>

          <Button
            variant={isEraser ? "secondary" : "outline"}
            onClick={() => setIsEraser(!isEraser)}
          >
            Eraser
          </Button>

          <Button variant="outline" onClick={clearCanvas}>
            Clear
          </Button>
        </div>

        <div style={{ height: 'calc(100% - 52px)', position: 'relative', overflow: 'auto' }}>
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerOut={handlePointerUp}
            style={{
              touchAction: 'none',
              width: '100%',
              height: '3000px'
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 cursor-ns-resize hover:bg-gray-300 transition-colors" />
      </div>
    </ResizableBox>
  );
}
