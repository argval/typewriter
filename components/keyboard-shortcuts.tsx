"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface KeyboardShortcutsProps {
  onNewFile: () => void
  onNewFolder: () => void
  onSave: () => void
  onSearch: () => void
  onToggleDarkMode: () => void
  onAddMarkdownCell: () => void
  onAddCodeCell: () => void
  onAddWhiteboardCell: () => void
  onRunCode: () => void
  onToggleAI: () => void
}

export function KeyboardShortcuts({
  onNewFile,
  onNewFolder,
  onSave,
  onSearch,
  onToggleDarkMode,
  onAddMarkdownCell,
  onAddCodeCell,
  onAddWhiteboardCell,
  onRunCode,
  onToggleAI,
}: KeyboardShortcutsProps) {
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, altKey, key } = event
      const isModifier = ctrlKey || metaKey

      // Prevent default for our shortcuts
      if (isModifier) {
        switch (key.toLowerCase()) {
          case "n":
            if (shiftKey) {
              event.preventDefault()
              onNewFolder()
              toast({
                title: "Keyboard Shortcut",
                description: "New folder created",
              })
            } else {
              event.preventDefault()
              onNewFile()
              toast({
                title: "Keyboard Shortcut",
                description: "New file created",
              })
            }
            break
          case "s":
            event.preventDefault()
            onSave()
            toast({
              title: "Keyboard Shortcut",
              description: "File saved",
            })
            break
          case "k":
            if (shiftKey) {
              event.preventDefault()
              onSearch()
              toast({
                title: "Keyboard Shortcut",
                description: "Search activated",
              })
            }
            break
          case "d":
            if (shiftKey) {
              event.preventDefault()
              onToggleDarkMode()
            }
            break
          case "m":
            if (shiftKey) {
              event.preventDefault()
              onAddMarkdownCell()
              toast({
                title: "Keyboard Shortcut",
                description: "Markdown cell added",
              })
            }
            break
          case "j":
            if (shiftKey) {
              event.preventDefault()
              onAddCodeCell()
              toast({
                title: "Keyboard Shortcut",
                description: "Code cell added",
              })
            }
            break
          case "w":
            if (shiftKey) {
              event.preventDefault()
              onAddWhiteboardCell()
              toast({
                title: "Keyboard Shortcut",
                description: "Whiteboard cell added",
              })
            }
            break
          case "enter":
            if (shiftKey) {
              event.preventDefault()
              onRunCode()
            }
            break
          case "i":
            if (shiftKey) {
              event.preventDefault()
              onToggleAI()
              toast({
                title: "Keyboard Shortcut",
                description: "AI Assistant toggled",
              })
            }
            break
        }
      }

      // Help shortcut
      if (key === "?" && shiftKey) {
        event.preventDefault()
        showShortcutsHelp()
      }
    }

    const showShortcutsHelp = () => {
      toast({
        title: "Keyboard Shortcuts",
        description: `
Ctrl/Cmd + N: New File
Ctrl/Cmd + Shift + N: New Folder
Ctrl/Cmd + S: Save
Ctrl/Cmd + Shift + K: Search
Ctrl/Cmd + Shift + D: Toggle Dark Mode
Ctrl/Cmd + Shift + M: Add Markdown Cell
Ctrl/Cmd + Shift + J: Add Code Cell
Ctrl/Cmd + Shift + W: Add Whiteboard Cell
Ctrl/Cmd + Shift + Enter: Run Code
Ctrl/Cmd + Shift + I: Toggle AI Assistant
Shift + ?: Show this help
        `,
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    onNewFile,
    onNewFolder,
    onSave,
    onSearch,
    onToggleDarkMode,
    onAddMarkdownCell,
    onAddCodeCell,
    onAddWhiteboardCell,
    onRunCode,
    onToggleAI,
    toast,
  ])

  return null
}
