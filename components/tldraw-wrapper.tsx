"use client"

import { Tldraw as TldrawComponent, type Editor } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"
import { useState, useEffect, useCallback } from "react"

interface TldrawProps {
  onSave?: (data: any) => void
  initialData?: any
}

export function Tldraw({ onSave, initialData }: TldrawProps) {
  const [editor, setEditor] = useState<Editor | null>(null)

  const handleMount = useCallback(
    (editor: Editor) => {
      setEditor(editor)

      // Load initial data if provided
      if (initialData) {
        try {
          editor.loadSnapshot(initialData)
        } catch (error) {
          console.warn("Failed to load initial data:", error)
        }
      }
    },
    [initialData],
  )

  // Save the drawing data when the editor changes
  useEffect(() => {
    if (editor && onSave) {
      const handleChange = () => {
        try {
          // Get the current snapshot
          const snapshot = editor.getSnapshot()
          onSave(snapshot)
        } catch (error) {
          console.warn("Failed to save drawing data:", error)
        }
      }

      // Add a listener for changes with a debounce
      let timeoutId: NodeJS.Timeout
      const debouncedHandleChange = () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(handleChange, 500) // Debounce for 500ms
      }

      // Listen to history changes
      const dispose = editor.store.listen(debouncedHandleChange, { scope: "all" })

      // Clean up the listener when the component unmounts
      return () => {
        clearTimeout(timeoutId)
        dispose()
      }
    }
  }, [editor, onSave])

  return (
    <div className="h-full w-full">
      <TldrawComponent onMount={handleMount} />
    </div>
  )
}
