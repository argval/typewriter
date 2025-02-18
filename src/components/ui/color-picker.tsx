'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  onChange: (color: string) => void;
  defaultColor?: string;
}

export function ColorPicker({ onChange, defaultColor = '#000000' }: ColorPickerProps) {
  const [color, setColor] = useState(defaultColor);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    onChange(newColor);
  }, [onChange]);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8 rounded-full p-0 overflow-hidden"
        onClick={() => inputRef.current?.click()}
      >
        <div 
          className={cn(
            "w-full h-full rounded-full border border-border",
            "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          style={{ backgroundColor: color }}
        />
      </Button>
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
}
