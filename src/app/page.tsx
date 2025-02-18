'use client';

import { useState } from 'react';
import { Notebook } from '@/components/notebook';
import { Sidebar } from '@/components/sidebar';
import { Notebook as NotebookType } from '@/types';

export default function Home() {
  const [notebooks, setNotebooks] = useState<NotebookType[]>([]);
  const [selectedNotebookId, setSelectedNotebookId] = useState<string>('');

  const selectedNotebook = notebooks.find(n => n.id === selectedNotebookId);

  return (
    <div className="flex h-screen">
      <Sidebar
        notebooks={notebooks}
        onSelectNotebook={setSelectedNotebookId}
        selectedNotebookId={selectedNotebookId}
        setNotebooks={setNotebooks}
      />
      <main className="flex-1 overflow-auto">
        {selectedNotebook ? (
          <Notebook
            key={selectedNotebookId}
            cells={selectedNotebook.cells}
            setCells={(cells) => {
              setNotebooks(prev => prev.map(n =>
                n.id === selectedNotebookId ? { ...n, cells } : n
              ));
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400">
            Select or create a notebook to start
          </div>
        )}
      </main>
    </div>
  );
}
