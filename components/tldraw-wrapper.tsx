"use client"

import { Tldraw as TldrawComponent } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"

export function Tldraw() {
  return (
    <div className="h-full w-full">
      <TldrawComponent />
    </div>
  )
}
