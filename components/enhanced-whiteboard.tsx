"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Pen, Eraser, Square, Circle, Minus, Type, Download, Upload, RotateCcw, RotateCw, Trash } from "lucide-react"

interface EnhancedWhiteboardProps {
  onSave?: (data: any) => void
  initialData?: any
}

export function EnhancedWhiteboard({ onSave, initialData }: EnhancedWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<"pen" | "eraser" | "rectangle" | "circle" | "line" | "text">("pen")
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(2)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
    "#808080",
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set default styles
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Load initial data if provided
    if (initialData) {
      // Load saved drawing data
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        saveToHistory()
      }
      img.src = initialData
    } else {
      // Clear canvas and save initial state
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      saveToHistory()
    }
  }, [initialData])

  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const newIndex = historyIndex - 1
      ctx.putImageData(history[newIndex], 0, 0)
      setHistoryIndex(newIndex)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const newIndex = historyIndex + 1
      ctx.putImageData(history[newIndex], 0, 0)
      setHistoryIndex(newIndex)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color
    ctx.lineWidth = brushSize
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over"

    if (tool === "pen" || tool === "eraser") {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (tool === "pen" || tool === "eraser") {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveToHistory()
    }
  }

  const exportCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = "whiteboard.png"
    link.href = dataURL
    link.click()

    if (onSave) {
      onSave(dataURL)
    }
  }

  const importImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.drawImage(img, 0, 0)
        saveToHistory()
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Drawing Tools */}
            <div className="flex gap-2">
              <Button variant={tool === "pen" ? "default" : "outline"} size="sm" onClick={() => setTool("pen")}>
                <Pen className="h-4 w-4" />
              </Button>
              <Button variant={tool === "eraser" ? "default" : "outline"} size="sm" onClick={() => setTool("eraser")}>
                <Eraser className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === "rectangle" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("rectangle")}
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button variant={tool === "circle" ? "default" : "outline"} size="sm" onClick={() => setTool("circle")}>
                <Circle className="h-4 w-4" />
              </Button>
              <Button variant={tool === "line" ? "default" : "outline"} size="sm" onClick={() => setTool("line")}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant={tool === "text" ? "default" : "outline"} size="sm" onClick={() => setTool("text")}>
                <Type className="h-4 w-4" />
              </Button>
            </div>

            {/* Colors */}
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-6 h-6 rounded border-2 ${color === c ? "border-gray-800" : "border-gray-300"}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 rounded border-2 border-gray-300"
              />
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Size:</span>
              <Slider
                value={[brushSize]}
                onValueChange={(value) => setBrushSize(value[0])}
                max={20}
                min={1}
                step={1}
                className="w-20"
              />
              <span className="text-sm w-6">{brushSize}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <Trash className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={exportCanvas}>
                <Download className="h-4 w-4" />
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                  </span>
                </Button>
                <input type="file" accept="image/*" onChange={importImage} className="hidden" />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <div className="flex-1 border rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  )
}
