"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Folder,
  FolderOpen,
  FileText,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Copy,
  Search,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  parentId?: string
  children?: FileItem[]
  isExpanded?: boolean
  lastModified: string
}

interface FileSidebarProps {
  files: FileItem[]
  onFileSelect: (fileId: string) => void
  onFileCreate: (name: string, parentId?: string) => void
  onFolderCreate: (name: string, parentId?: string) => void
  onFileRename: (fileId: string, newName: string) => void
  onFileDelete: (fileId: string) => void
  selectedFileId?: string
}

export function FileSidebar({
  files,
  onFileSelect,
  onFileCreate,
  onFolderCreate,
  onFileRename,
  onFileDelete,
  selectedFileId,
}: FileSidebarProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemParent, setNewItemParent] = useState<string | undefined>()

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const startEditing = (file: FileItem) => {
    setEditingId(file.id)
    setEditingName(file.name)
  }

  const finishEditing = () => {
    if (editingId && editingName.trim()) {
      onFileRename(editingId, editingName.trim())
    }
    setEditingId(null)
    setEditingName("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      finishEditing()
    } else if (e.key === "Escape") {
      setEditingId(null)
      setEditingName("")
    }
  }

  const createNewFile = () => {
    if (newItemName.trim()) {
      onFileCreate(newItemName.trim(), newItemParent)
      setNewItemName("")
      setShowNewFileDialog(false)
      toast({
        title: "File created",
        description: `"${newItemName}" has been created.`,
      })
    }
  }

  const createNewFolder = () => {
    if (newItemName.trim()) {
      onFolderCreate(newItemName.trim(), newItemParent)
      setNewItemName("")
      setShowNewFolderDialog(false)
      toast({
        title: "Folder created",
        description: `"${newItemName}" folder has been created.`,
      })
    }
  }

  const filterFiles = (items: FileItem[], term: string): FileItem[] => {
    if (!term) return items

    return items.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(term.toLowerCase())
      const hasMatchingChildren = item.children && filterFiles(item.children, term).length > 0
      return matchesName || hasMatchingChildren
    })
  }

  const renderFileItem = (item: FileItem, level = 0) => {
    const isExpanded = expandedFolders.has(item.id)
    const isSelected = selectedFileId === item.id
    const isEditing = editingId === item.id

    return (
      <div key={item.id}>
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
            isSelected && "bg-blue-100 dark:bg-blue-900",
            "group",
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {item.type === "folder" && (
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => toggleFolder(item.id)}>
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          )}

          {item.type === "folder" ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )
          ) : (
            <FileText className="h-4 w-4 text-gray-500" />
          )}

          {isEditing ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={handleKeyPress}
              className="h-6 text-sm"
              autoFocus
            />
          ) : (
            <span className="flex-1 truncate" onClick={() => item.type === "file" && onFileSelect(item.id)}>
              {item.name}
            </span>
          )}

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => startEditing(item)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFileDelete(item.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                {item.type === "folder" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        setNewItemParent(item.id)
                        setShowNewFileDialog(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New File
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setNewItemParent(item.id)
                        setShowNewFolderDialog(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Folder
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => onFileDelete(item.id)} className="text-red-600">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {item.type === "folder" && isExpanded && item.children && (
          <div>{item.children.map((child) => renderFileItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  const filteredFiles = filterFiles(files, searchTerm)

  return (
    <div className="w-64 border-r bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-800">
        <h1 className="text-xl font-bold mb-2">NoteSync</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-9 h-8 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-1">{filteredFiles.map((item) => renderFileItem(item))}</div>
      </div>

      <div className="p-4 border-t dark:border-gray-800 space-y-2">
        <div className="flex gap-2">
          <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Plus className="h-3 w-3" />
                File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="File name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createNewFile()}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewFileDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewFile}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Plus className="h-3 w-3" />
                Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Folder name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createNewFolder()}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewFolder}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500 h-2 w-2"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Synced to cloud</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Last sync: 2 minutes ago</div>
        </div>
      </div>
    </div>
  )
}
