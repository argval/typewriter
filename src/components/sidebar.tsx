'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Plus, File, FolderPlus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Notebook } from '@/types';

interface SidebarProps {
  notebooks: Notebook[];
  onSelectNotebook: (id: string) => void;
  selectedNotebookId?: string;
  setNotebooks: React.Dispatch<React.SetStateAction<Notebook[]>>;
}

export function Sidebar({ notebooks, onSelectNotebook, selectedNotebookId, setNotebooks }: SidebarProps) {
  const [isNewNotebookDialogOpen, setIsNewNotebookDialogOpen] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');

  const createNotebook = () => {
    if (!newNotebookName.trim()) return;

    const newNotebook: Notebook = {
      id: Math.random().toString(36).substring(7),
      name: newNotebookName,
      cells: [], // Initialize with empty cells
    };

    setNotebooks((prev) => [...prev, newNotebook]);
    setNewNotebookName('');
    setIsNewNotebookDialogOpen(false);

    // Select the new notebook
    onSelectNotebook(newNotebook.id);
  };

  const deleteNotebook = (id: string) => {
    setNotebooks((prev) => prev.filter((notebook) => notebook.id !== id));
    if (selectedNotebookId === id) {
      onSelectNotebook('');
    }
  };

  return (
    <div className="w-64 h-screen bg-zinc-50 border-r p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Notebooks</h2>
        <Dialog open={isNewNotebookDialogOpen} onOpenChange={setIsNewNotebookDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Notebook</DialogTitle>
              <DialogDescription>
                Enter a name for your new notebook.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newNotebookName}
                onChange={(e) => setNewNotebookName(e.target.value)}
                placeholder="Notebook name..."
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewNotebookDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createNotebook}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-1">
        {notebooks.map((notebook) => (
          <div
            key={notebook.id}
            className={`
              flex items-center justify-between group px-2 py-1 rounded-md
              ${selectedNotebookId === notebook.id ? 'bg-zinc-200' : 'hover:bg-zinc-100'}
              cursor-pointer
            `}
            onClick={() => onSelectNotebook(notebook.id)}
          >
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span className="text-sm">{notebook.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                deleteNotebook(notebook.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {notebooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
            <FolderPlus className="h-8 w-8 mb-2" />
            <p className="text-sm text-center">
              No notebooks yet.
              <br />
              Create one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
