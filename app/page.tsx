"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  Code,
  FileText,
  Grid,
  Pen,
  Plus,
  Search,
  Users,
  Zap,
  Play,
  Loader2,
  Copy,
  Trash,
  MoveUp,
  MoveDown,
  Download,
  Moon,
  Sun,
  Save,
  Share2,
} from "lucide-react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { FileSidebar } from "@/components/file-sidebar"
import { AIAssistant } from "@/components/ai-assistant"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { EnhancedWhiteboard } from "@/components/enhanced-whiteboard"
import { Collaboration } from "@/components/collaboration"

interface Cell {
  id: string
  type: "markdown" | "code" | "whiteboard"
  content: string
  language?: string
  isEditing?: boolean
  output?: string
  isExecuting?: boolean
  error?: string
  drawingData?: any
}

interface Notebook {
  id: string
  name: string
  lastModified: string
  cells: Cell[]
  parentId?: string
}

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  parentId?: string
  children?: FileItem[]
  lastModified: string
}

export default function NotebookApp() {
  const { toast } = useToast()
  const [darkMode, setDarkMode] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [currentNotebookId, setCurrentNotebookId] = useState<string | null>(null)
  const [showAI, setShowAI] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "folder1",
      name: "Projects",
      type: "folder",
      lastModified: "2 hours ago",
      children: [
        {
          id: "notebook1",
          name: "Project Research Notes",
          type: "file",
          parentId: "folder1",
          lastModified: "2 hours ago",
        },
        {
          id: "notebook2",
          name: "Python Data Analysis",
          type: "file",
          parentId: "folder1",
          lastModified: "Yesterday",
        },
      ],
    },
    {
      id: "folder2",
      name: "Study Notes",
      type: "folder",
      lastModified: "3 days ago",
      children: [
        {
          id: "notebook3",
          name: "Algorithm Study",
          type: "file",
          parentId: "folder2",
          lastModified: "1 week ago",
        },
      ],
    },
    {
      id: "notebook4",
      name: "Meeting Whiteboard",
      type: "file",
      lastModified: "3 days ago",
    },
    {
      id: "notebook5",
      name: "Product Design Ideas",
      type: "file",
      lastModified: "2 weeks ago",
    },
    {
      id: "notebook6",
      name: "JavaScript Snippets",
      type: "file",
      lastModified: "1 month ago",
    },
  ])

  const [notebooks, setNotebooks] = useState<Notebook[]>([
    {
      id: "notebook1",
      name: "Project Research Notes",
      lastModified: "2 hours ago",
      cells: [
        {
          id: "cell1",
          type: "markdown",
          content: `# Welcome to your notebook

This is a markdown cell. You can write formatted text here.

## Features

- **Bold** and *italic* text
- Lists and checkboxes
  - [x] Task 1
  - [ ] Task 2
- [Links](https://example.com)
- Code blocks:

\`\`\`javascript
function hello() {
  console.log("Hello world!");
}
\`\`\`

- Tables:

| Name | Value |
|------|-------|
| Item 1 | 100 |
| Item 2 | 200 |
`,
          isEditing: false,
        },
        {
          id: "cell2",
          type: "code",
          content: `// This is a JavaScript code cell
// You can run this code directly in the browser

function generateData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      x: i,
      y: Math.sin(i * 0.2) * Math.random() * 10
    });
  }
  return data;
}

// Generate and return some data
const result = generateData(20);
console.log("Generated data points:", result);
return result;`,
          language: "javascript",
          isEditing: false,
          output: "",
        },
        {
          id: "cell3",
          type: "whiteboard",
          content: "",
          isEditing: false,
        },
      ],
    },
  ])

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedFiles = localStorage.getItem("files")
    const savedNotebooks = localStorage.getItem("notebooks")
    const savedDarkMode = localStorage.getItem("darkMode")

    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles))
      } catch (error) {
        console.error("Failed to parse files from localStorage:", error)
      }
    }

    if (savedNotebooks) {
      try {
        setNotebooks(JSON.parse(savedNotebooks))
      } catch (error) {
        console.error("Failed to parse notebooks from localStorage:", error)
      }
    }

    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files))
  }, [files])

  useEffect(() => {
    localStorage.setItem("notebooks", JSON.stringify(notebooks))
  }, [notebooks])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const currentNotebook = notebooks.find((notebook) => notebook.id === currentNotebookId) || notebooks[0]

  const openNotebook = (fileId: string) => {
    setCurrentNotebookId(fileId)
    setShowEditor(true)
  }

  const handleFileCreate = (name: string, parentId?: string) => {
    const newNotebook: Notebook = {
      id: `notebook${Date.now()}`,
      name,
      lastModified: "Just now",
      cells: [],
      parentId,
    }

    const newFile: FileItem = {
      id: newNotebook.id,
      name,
      type: "file",
      parentId,
      lastModified: "Just now",
    }

    setNotebooks([...notebooks, newNotebook])

    if (parentId) {
      setFiles(
        files.map((file) => {
          if (file.id === parentId && file.type === "folder") {
            return {
              ...file,
              children: [...(file.children || []), newFile],
            }
          }
          return file
        }),
      )
    } else {
      setFiles([...files, newFile])
    }
  }

  const handleFolderCreate = (name: string, parentId?: string) => {
    const newFolder: FileItem = {
      id: `folder${Date.now()}`,
      name,
      type: "folder",
      parentId,
      lastModified: "Just now",
      children: [],
    }

    if (parentId) {
      setFiles(
        files.map((file) => {
          if (file.id === parentId && file.type === "folder") {
            return {
              ...file,
              children: [...(file.children || []), newFolder],
            }
          }
          return file
        }),
      )
    } else {
      setFiles([...files, newFolder])
    }
  }

  const handleFileRename = (fileId: string, newName: string) => {
    // Update in files
    const updateFileInTree = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === fileId) {
          return { ...item, name: newName }
        }
        if (item.children) {
          return { ...item, children: updateFileInTree(item.children) }
        }
        return item
      })
    }

    setFiles(updateFileInTree(files))

    // Update in notebooks if it's a file
    setNotebooks(notebooks.map((notebook) => (notebook.id === fileId ? { ...notebook, name: newName } : notebook)))
  }

  const handleFileDelete = (fileId: string) => {
    // Remove from files
    const removeFileFromTree = (items: FileItem[]): FileItem[] => {
      return items.filter((item) => {
        if (item.id === fileId) return false
        if (item.children) {
          item.children = removeFileFromTree(item.children)
        }
        return true
      })
    }

    setFiles(removeFileFromTree(files))

    // Remove from notebooks if it's a file
    setNotebooks(notebooks.filter((notebook) => notebook.id !== fileId))

    // Close editor if current notebook is deleted
    if (currentNotebookId === fileId) {
      setShowEditor(false)
      setCurrentNotebookId(null)
    }
  }

  // AI Assistant functions
  const handleCodeOptimize = async (code: string): Promise<string> => {
    // Simulate AI optimization
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return `// Optimized version of your code
${code}

// AI Suggestions:
// 1. Consider using const instead of let where possible
// 2. Add error handling for edge cases
// 3. Consider memoization for expensive operations`
  }

  const handleCodeExplain = async (code: string): Promise<string> => {
    // Simulate AI explanation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return `This code appears to be a ${code.includes("function") ? "function" : "script"} that:

1. Defines variables and data structures
2. Implements core logic for processing
3. Returns or outputs results

Key concepts used:
- ${code.includes("for") ? "Loops for iteration" : ""}
- ${code.includes("if") ? "Conditional statements" : ""}
- ${code.includes("function") ? "Function definitions" : ""}

The code follows ${code.includes("const") || code.includes("let") ? "modern JavaScript" : "traditional"} patterns.`
  }

  const handleMarkdownEnhance = async (content: string): Promise<string> => {
    // Simulate AI enhancement
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return `# Enhanced Version

${content}

## AI Suggestions:
- Added proper heading structure
- Improved formatting and readability
- Consider adding more specific examples
- Use bullet points for better organization`
  }

  const handleGenerateContent = async (prompt: string): Promise<string> => {
    // Simulate AI content generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return `Based on your prompt: "${prompt}"

Here's some generated content:

This is a simulated AI response that would provide relevant information, code examples, or explanations based on your specific request. In a real implementation, this would connect to an AI service like OpenAI's GPT or similar.

Key points:
- Relevant to your query
- Structured and helpful
- Ready to use in your notebook`
  }

  // Keyboard shortcuts handlers
  const handleNewFile = () => handleFileCreate(`New File ${Date.now()}`)
  const handleNewFolder = () => handleFolderCreate(`New Folder ${Date.now()}`)
  const handleSave = () => {
    if (currentNotebook) {
      const updatedNotebook = {
        ...currentNotebook,
        lastModified: "Just now",
      }
      setNotebooks(notebooks.map((n) => (n.id === currentNotebook.id ? updatedNotebook : n)))
    }
  }
  const handleSearch = () => {
    // Focus search input
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    }
  }
  const handleToggleDarkMode = () => setDarkMode(!darkMode)
  const handleAddMarkdownCell = () => addCell("markdown")
  const handleAddCodeCell = () => addCell("code")
  const handleAddWhiteboardCell = () => addCell("whiteboard")
  const handleRunCode = () => {
    // Run the first code cell that's not executing
    const codeCell = currentNotebook?.cells.find((cell) => cell.type === "code" && !cell.isExecuting)
    if (codeCell) {
      executeCode(codeCell.id)
    }
  }
  const handleToggleAI = () => setShowAI(!showAI)

  // Rest of the component logic remains the same...
  // (addCell, updateNotebook, executeCode, etc.)

  const updateNotebook = (updatedNotebook: Notebook) => {
    setNotebooks(notebooks.map((notebook) => (notebook.id === updatedNotebook.id ? updatedNotebook : notebook)))
  }

  const addCell = (type: "markdown" | "code" | "whiteboard") => {
    if (!currentNotebook) return

    const newCell: Cell = {
      id: `cell${Date.now()}`,
      type,
      content:
        type === "markdown"
          ? "New markdown cell - click to edit"
          : type === "code"
            ? "// New code cell\n// Start coding here"
            : "",
      language: type === "code" ? "javascript" : undefined,
      isEditing: false,
    }

    const updatedNotebook = {
      ...currentNotebook,
      cells: [...currentNotebook.cells, newCell],
      lastModified: "Just now",
    }

    updateNotebook(updatedNotebook)
  }

  const toggleEditMode = (cellId: string) => {
    if (!currentNotebook) return

    const updatedNotebook = {
      ...currentNotebook,
      cells: currentNotebook.cells.map((cell) => (cell.id === cellId ? { ...cell, isEditing: !cell.isEditing } : cell)),
    }

    updateNotebook(updatedNotebook)
  }

  const updateCellContent = (cellId: string, content: string) => {
    if (!currentNotebook) return

    const updatedNotebook = {
      ...currentNotebook,
      cells: currentNotebook.cells.map((cell) => (cell.id === cellId ? { ...cell, content } : cell)),
      lastModified: "Just now",
    }

    updateNotebook(updatedNotebook)
  }

  const updateCellLanguage = (cellId: string, language: string) => {
    if (!currentNotebook) return

    const updatedNotebook = {
      ...currentNotebook,
      cells: currentNotebook.cells.map((cell) => (cell.id === cellId ? { ...cell, language } : cell)),
    }

    updateNotebook(updatedNotebook)
  }

  const executeCode = async (cellId: string) => {
    if (!currentNotebook) return

    const cell = currentNotebook.cells.find((c) => c.id === cellId)
    if (!cell || cell.type !== "code") return

    // Set the cell to executing state
    const updatedNotebook = {
      ...currentNotebook,
      cells: currentNotebook.cells.map((c) =>
        c.id === cellId ? { ...c, isExecuting: true, output: "", error: undefined } : c,
      ),
    }
    updateNotebook(updatedNotebook)

    try {
      if (cell.language === "javascript") {
        // Execute JavaScript code directly in the browser
        const consoleOutput: string[] = []
        const originalConsoleLog = console.log

        // Override console.log to capture output
        console.log = (...args) => {
          consoleOutput.push(
            args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" "),
          )
          originalConsoleLog(...args)
        }

        try {
          // Create a function from the code and execute it
          const result = new Function(cell.content + `; return undefined;`)()

          // Restore original console.log
          console.log = originalConsoleLog

          // Format the output
          let output = consoleOutput.join("\n")

          if (result !== undefined) {
            output += (output ? "\n\n" : "") + "Result: " + JSON.stringify(result, null, 2)
          }

          const finalNotebook = {
            ...currentNotebook,
            cells: currentNotebook.cells.map((c) => (c.id === cellId ? { ...c, output, isExecuting: false } : c)),
          }
          updateNotebook(finalNotebook)
        } catch (error) {
          console.log = originalConsoleLog
          throw error
        }
      } else if (cell.language === "python") {
        // Simulate Python execution with a delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock Python execution result
        const output =
          "Python execution requires a backend service.\n\nThis is a simulated output for demonstration purposes.\n\n[Execution would show results here]"

        const finalNotebook = {
          ...currentNotebook,
          cells: currentNotebook.cells.map((c) => (c.id === cellId ? { ...c, output, isExecuting: false } : c)),
        }
        updateNotebook(finalNotebook)
      }
    } catch (error) {
      const errorNotebook = {
        ...currentNotebook,
        cells: currentNotebook.cells.map((c) =>
          c.id === cellId ? { ...c, error: String(error), isExecuting: false } : c,
        ),
      }
      updateNotebook(errorNotebook)
    }
  }

  const deleteCell = (cellId: string) => {
    if (!currentNotebook) return

    const updatedNotebook = {
      ...currentNotebook,
      cells: currentNotebook.cells.filter((cell) => cell.id !== cellId),
      lastModified: "Just now",
    }

    updateNotebook(updatedNotebook)
    toast({
      title: "Cell deleted",
      description: "The cell has been removed from your notebook.",
    })
  }

  const duplicateCell = (cellId: string) => {
    if (!currentNotebook) return

    const cellToDuplicate = currentNotebook.cells.find((cell) => cell.id === cellId)
    if (!cellToDuplicate) return

    const newCell: Cell = {
      ...cellToDuplicate,
      id: `cell${Date.now()}`,
      isEditing: false,
      isExecuting: false,
      output: "",
      error: undefined,
    }

    const cellIndex = currentNotebook.cells.findIndex((cell) => cell.id === cellId)
    const updatedCells = [...currentNotebook.cells]
    updatedCells.splice(cellIndex + 1, 0, newCell)

    const updatedNotebook = {
      ...currentNotebook,
      cells: updatedCells,
      lastModified: "Just now",
    }

    updateNotebook(updatedNotebook)
    toast({
      title: "Cell duplicated",
      description: "A copy of the cell has been created.",
    })
  }

  const moveCell = (cellId: string, direction: "up" | "down") => {
    if (!currentNotebook) return

    const cellIndex = currentNotebook.cells.findIndex((cell) => cell.id === cellId)
    if (
      (direction === "up" && cellIndex === 0) ||
      (direction === "down" && cellIndex === currentNotebook.cells.length - 1)
    ) {
      return
    }

    const updatedCells = [...currentNotebook.cells]
    const targetIndex = direction === "up" ? cellIndex - 1 : cellIndex + 1

    // Swap cells
    const temp = updatedCells[cellIndex]
    updatedCells[cellIndex] = updatedCells[targetIndex]
    updatedCells[targetIndex] = temp

    const updatedNotebook = {
      ...currentNotebook,
      cells: updatedCells,
      lastModified: "Just now",
    }

    updateNotebook(updatedNotebook)
  }

  const exportNotebook = (format: "pdf" | "html" | "markdown" | "json") => {
    if (!currentNotebook) return

    if (format === "json") {
      // Export as JSON
      const dataStr = JSON.stringify(currentNotebook, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${currentNotebook.name}.json`
      link.click()
      URL.revokeObjectURL(url)
    } else if (format === "markdown") {
      // Export as Markdown
      let markdownContent = `# ${currentNotebook.name}\n\n`
      currentNotebook.cells.forEach((cell) => {
        if (cell.type === "markdown") {
          markdownContent += cell.content + "\n\n"
        } else if (cell.type === "code") {
          markdownContent += `\`\`\`${cell.language || "javascript"}\n${cell.content}\n\`\`\`\n\n`
          if (cell.output) {
            markdownContent += `**Output:**\n\`\`\`\n${cell.output}\n\`\`\`\n\n`
          }
        }
      })

      const dataBlob = new Blob([markdownContent], { type: "text/markdown" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${currentNotebook.name}.md`
      link.click()
      URL.revokeObjectURL(url)
    } else {
      // For PDF and HTML, show a toast (would require backend in real implementation)
      toast({
        title: `Export as ${format.toUpperCase()}`,
        description: `Your notebook "${currentNotebook.name}" would be exported as ${format.toUpperCase()}.`,
      })
    }
  }

  const renderCell = (cell: Cell) => {
    switch (cell.type) {
      case "markdown":
        return (
          <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Markdown</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => toggleEditMode(cell.id)} className="h-8 px-2 text-xs">
                  {cell.isEditing ? "Done" : "Edit"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => duplicateCell(cell.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveCell(cell.id, "up")}>
                      <MoveUp className="h-4 w-4 mr-2" />
                      <span>Move Up</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveCell(cell.id, "down")}>
                      <MoveDown className="h-4 w-4 mr-2" />
                      <span>Move Down</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteCell(cell.id)} className="text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {cell.isEditing ? (
              <Textarea
                value={cell.content}
                onChange={(e) => updateCellContent(cell.id, e.target.value)}
                className="min-h-[150px] font-mono text-sm dark:bg-gray-900 dark:text-gray-100"
                placeholder="Enter markdown content here..."
              />
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <MarkdownRenderer content={cell.content} />
              </div>
            )}
          </div>
        )
      case "code":
        return (
          <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-green-500" />
                <select
                  value={cell.language}
                  onChange={(e) => updateCellLanguage(cell.id, e.target.value)}
                  className="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 dark:text-gray-200 dark:bg-gray-800"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => toggleEditMode(cell.id)} className="h-8 px-2 text-xs">
                  {cell.isEditing ? "Done" : "Edit"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => duplicateCell(cell.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveCell(cell.id, "up")}>
                      <MoveUp className="h-4 w-4 mr-2" />
                      <span>Move Up</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveCell(cell.id, "down")}>
                      <MoveDown className="h-4 w-4 mr-2" />
                      <span>Move Down</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteCell(cell.id)} className="text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {cell.isEditing ? (
              <Textarea
                value={cell.content}
                onChange={(e) => updateCellContent(cell.id, e.target.value)}
                className="min-h-[150px] font-mono text-sm bg-gray-50 p-3 dark:bg-gray-900 dark:text-gray-100"
                placeholder="Enter code here..."
              />
            ) : (
              <div className="bg-gray-50 p-3 rounded font-mono text-sm overflow-x-auto dark:bg-gray-900">
                <pre className="text-gray-800 dark:text-gray-200">{cell.content}</pre>
              </div>
            )}

            <div className="mt-2 flex justify-between">
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1"
                onClick={() => executeCode(cell.id)}
                disabled={cell.isExecuting}
              >
                {cell.isExecuting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    Run
                  </>
                )}
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

            {(cell.output || cell.error) && (
              <div className="mt-3 border-t pt-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Output:</div>
                {cell.error ? (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-xs font-mono whitespace-pre-wrap">{cell.error}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="bg-gray-50 p-3 rounded font-mono text-xs overflow-x-auto max-h-[200px] overflow-y-auto dark:bg-gray-900 dark:text-gray-200">
                    <pre className="text-gray-800 whitespace-pre-wrap dark:text-gray-200">{cell.output}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      case "whiteboard":
        return (
          <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Pen className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Whiteboard</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => toggleEditMode(cell.id)} className="h-8 px-2 text-xs">
                  {cell.isEditing ? "Done" : "Edit"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => duplicateCell(cell.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveCell(cell.id, "up")}>
                      <MoveUp className="h-4 w-4 mr-2" />
                      <span>Move Up</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveCell(cell.id, "down")}>
                      <MoveDown className="h-4 w-4 mr-2" />
                      <span>Move Down</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteCell(cell.id)} className="text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {cell.isEditing ? (
              <div className="h-[400px] border rounded-lg overflow-hidden">
                <EnhancedWhiteboard
                  onSave={(data) => updateCellContent(cell.id, data)}
                  initialData={cell.drawingData}
                />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center h-64 dark:bg-gray-900 dark:border-gray-700">
                {cell.content || cell.drawingData ? (
                  <div className="w-full h-full bg-white dark:bg-gray-800">
                    {/* Rendered whiteboard content would go here */}
                    <div className="text-center pt-16">
                      <Pen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Whiteboard content</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Pen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Click "Edit" to start drawing</p>
                    <Button
                      size="sm"
                      variant="default"
                      className="text-xs mt-2"
                      onClick={() => toggleEditMode(cell.id)}
                    >
                      Start Drawing
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`flex h-screen bg-white dark:bg-gray-900 dark:text-gray-100`}>
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onSave={handleSave}
        onSearch={handleSearch}
        onToggleDarkMode={handleToggleDarkMode}
        onAddMarkdownCell={handleAddMarkdownCell}
        onAddCodeCell={handleAddCodeCell}
        onAddWhiteboardCell={handleAddWhiteboardCell}
        onRunCode={handleRunCode}
        onToggleAI={handleToggleAI}
      />

      {/* File Sidebar */}
      <FileSidebar
        files={files}
        onFileSelect={openNotebook}
        onFileCreate={handleFileCreate}
        onFolderCreate={handleFolderCreate}
        onFileRename={handleFileRename}
        onFileDelete={handleFileDelete}
        selectedFileId={currentNotebookId}
      />

      {showEditor ? (
        <div className="flex-1 flex">
          {/* Main Editor */}
          <div className="flex-1 flex flex-col h-screen">
            <header className="flex items-center justify-between border-b px-6 py-4 bg-white dark:bg-gray-900 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setShowEditor(false)}>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">{currentNotebook?.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Last edited {currentNotebook?.lastModified}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />3 collaborators
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  className="h-8 w-8"
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCollaboration(!showCollaboration)}
                  className="gap-2"
                >
                  <Users className="h-4 w-4" />
                  Collaborate
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => exportNotebook("pdf")}>
                      <span>Export as PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportNotebook("html")}>
                      <span>Export as HTML</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportNotebook("markdown")}>
                      <span>Export as Markdown</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportNotebook("json")}>
                      <span>Export as JSON</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button size="sm" className="gap-2" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </header>

            <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-4xl mx-auto space-y-6">
                {currentNotebook?.cells.map((cell) => (
                  <div key={cell.id} className="relative group">
                    {renderCell(cell)}
                  </div>
                ))}

                {/* Add Cell Button with Dropdown */}
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

            <footer className="border-t px-6 py-3 bg-white dark:bg-gray-900 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-500 h-2 w-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">Synced to cloud</span>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setShowAI(!showAI)}>
                    <Zap className="h-3 w-3" />
                    AI Assistant
                  </Button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Auto-save enabled</span>
                </div>
              </div>
            </footer>
          </div>

          {/* Collaboration Panel */}
          {showCollaboration && (
            <div className="w-80 border-l bg-white dark:bg-gray-900 dark:border-gray-800 p-4 overflow-auto">
              <Collaboration
                notebookId={currentNotebookId || ""}
                onInviteUser={(email) => {
                  toast({
                    title: "Invitation sent",
                    description: `Invitation sent to ${email}`,
                  })
                }}
              />
            </div>
          )}
        </div>
      ) : (
        /* Main content - File Browser */
        <div className="flex-1">
          <header className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-800">
            <div className="w-96">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search notebooks..."
                  className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="mb-6 flex items-center gap-4">
              <Button className="gap-2" onClick={() => handleFileCreate(`New Notebook ${Date.now()}`)}>
                <Plus className="h-4 w-4" />
                New Notebook
              </Button>
              <Button variant="outline" className="gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Import
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleFolderCreate(`New Folder ${Date.now()}`)}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                New Folder
              </Button>
            </div>

            <div className="mb-6">
              <Tabs defaultValue="recent">
                <TabsList>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="shared">Shared</TabsTrigger>
                  <TabsTrigger value="ai">AI Enhanced</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Welcome to NoteSync</h3>
                <p className="text-sm">Create your first notebook or select one from the sidebar to get started.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      {showAI && (
        <AIAssistant
          onCodeOptimize={handleCodeOptimize}
          onCodeExplain={handleCodeExplain}
          onMarkdownEnhance={handleMarkdownEnhance}
          onGenerateContent={handleGenerateContent}
        />
      )}
    </div>
  )
}
