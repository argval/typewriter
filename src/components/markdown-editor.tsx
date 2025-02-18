'use client';

import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.css';

interface MarkdownEditorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function MarkdownEditor({ defaultValue = '', onChange }: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue: string | undefined) => {
    const updatedValue = newValue || '';
    setValue(updatedValue);
    onChange?.(updatedValue);
  };

  return (
    <div className="h-full">
      <MDEditor
        value={value}
        onChange={handleChange}
        preview="live"
        height="100%"
        previewOptions={{
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [rehypeKatex],
        }}
        className="wmde-markdown-var"
      />
    </div>
  );
}
