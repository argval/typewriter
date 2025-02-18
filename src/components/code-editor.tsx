'use client';

import { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  height?: string | number;
}

export function CodeEditor({ defaultValue = '', onChange, height }: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.layout();
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [height]);

  return (
    <div style={{ height: height || '100%', minHeight: '100px' }}>
      <Editor
        height="100%"
        defaultLanguage="python"
        defaultValue={defaultValue}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          padding: { top: 8, bottom: 8 },
        }}
        theme="vs-dark"
      />
    </div>
  );
}
