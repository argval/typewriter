"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Code, FileText, MoreVertical, Pen, Plus, Save, Share2, Trash, Users, Zap } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type CellType = "markdown" | "code" | "whiteboard"

interface Cell {
  id: string
  type: CellType
  content: string
}

interface NotebookEditorProps {
  title: string
  onClose: () => void
}

export default function NotebookEditor({ title, onClose }: NotebookEditorProps) {
  const [cells, setCells] = useState<Cell[]>([
    {
      id: "cell1",
      type: "markdown",
      content: "# Welcome to your notebook\n\nThis is a markdown cell. You can write formatted text here.",
    },
    {
      id: "cell2",
      type: "code",
      content:
        "# This is a Python code cell\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Generate some data\nx = np.linspace(0, 10, 100)\ny = np.sin(x)\n\n# Plot the data\nplt.figure(figsize=(8, 4))\nplt.plot(x, y)\nplt.title('Sine Wave')\nplt.xlabel('x')\nplt.ylabel('sin(x)')\nplt.grid(True)\nplt.show()",
    },
    { id: "cell3", type: "whiteboard", content: "Whiteboard content would be rendered here" },
  ])

  const [activeDevice, setActiveDevice] = useState<string>("desktop")
  const [collaborators, setCollaborators] = useState<number>(0)

  const addCell = (type: CellType) => {
    const newCell: Cell = {
      id: `cell${cells.length + 1}`,
      type,
      content: type === "markdown" ? "New markdown cell" : type === "code" ? "# New code cell" : "New whiteboard cell",
    }
    setCells([...cells, newCell])
  }

  const renderCell = (cell: Cell) => {
    switch (cell.type) {
      case "markdown":
        return (
          <div className="rounded-lg border p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Markdown</span>
              </div>
              <CellActions />
            </div>
            <div className="prose prose-sm max-w-none">
              <h1>Welcome to your notebook</h1>
              <p>This is a markdown cell. You can write formatted text here.</p>
            </div>
          </div>
        )
      case "code":
        return (
          <div className="rounded-lg border p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Python</span>
              </div>
              <CellActions />
            </div>
            <div className="bg-gray-50 p-3 rounded font-mono text-sm overflow-x-auto">
              <pre className="text-gray-800">{cell.content}</pre>
            </div>
            <div className="mt-2 flex justify-between">
              <Button size="sm" variant="outline" className="text-xs">
                Run
              </Button>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-xs flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Explain
                </Button>
                <Button size="sm" variant="ghost" className="text-xs flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Optimize
                </Button>
              </div>
            </div>
          </div>
        )
      case "whiteboard":
        return (
          <div className="rounded-lg border p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Pen className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Whiteboard</span>
              </div>
              <CellActions />
            </div>
            <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 flex items-center justify-center h-64">
              <div className="text-center">
                <Pen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Whiteboard content would be rendered here</p>
                <p className="text-xs text-gray-400 mt-1">Best used with tablet or mobile device</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <header className="flex items-center justify-between border-b px-6 py-4 bg-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Last edited 2 hours ago</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {collaborators > 0 ? `${collaborators} collaborator${collaborators > 1 ? "s" : ""}` : "Only you"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Device:</span>
            <Tabs value={activeDevice} onValueChange={setActiveDevice}>
              <TabsList>
                <TabsTrigger value="desktop" className="text-xs">
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="tablet" className="text-xs">
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="web" className="text-xs">
                  Web
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-6">
          {cells.map((cell) => (
            <div key={cell.id} className="relative group">
              {renderCell(cell)}
            </div>
          ))}

          <div className="flex justify-center py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Cell
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => addCell("markdown")}>
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Markdown</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addCell("code")}>
                  <Code className="h-4 w-4 mr-2 text-green-500" />
                  <span>Code</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addCell("whiteboard")}>
                  <Pen className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Whiteboard</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <footer className="border-t px-6 py-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500 h-2 w-2"></div>
            <span className="text-xs text-gray-600">Synced to cloud</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <Zap className="h-3 w-3" />
              AI Assistant
            </Button>
            <span className="text-xs text-gray-500">Auto-save enabled</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CellActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Zap className="h-4 w-4 mr-2" />
          <span>AI Enhance</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Duplicate
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">
          <Trash className="h-4 w-4 mr-2" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
