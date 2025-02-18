'use client';

import { useState } from 'react';
import { Resizable } from 're-resizable';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResizableCellProps {
  children: React.ReactNode;
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
}

export function ResizableCell({ 
  children, 
  defaultHeight = 200,
  minHeight = 100,
  maxHeight = 1000
}: ResizableCellProps) {
  const [height, setHeight] = useState(defaultHeight);

  return (
    <div className="relative">
      <Resizable
        size={{ width: '100%', height }}
        minHeight={minHeight}
        maxHeight={maxHeight}
        onResizeStop={(e, direction, ref, d) => {
          setHeight(height + d.height);
        }}
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        }}
        handleClasses={{
          bottom: 'h-2 bg-gray-100 hover:bg-gray-200 transition-colors cursor-row-resize flex items-center justify-center'
        }}
        handleComponent={{
          bottom: (
            <div className="flex flex-col items-center">
              <ChevronUp className="h-3 w-3" />
              <ChevronDown className="h-3 w-3 -mt-1" />
            </div>
          )
        }}
      >
        {children}
      </Resizable>
    </div>
  );
}
