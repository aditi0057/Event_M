"use client"

import { useEffect } from "react"
import { cn } from "@/lib/utils"

export function Drawer({ open, onClose, side = "right", children }: { open: boolean; onClose: () => void; side?: "right" | "left" | "bottom"; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null
  const placement = {
    right: "right-0 top-0 h-full w-full max-w-sm animate-in slide-in-from-right",
    left: "left-0 top-0 h-full w-full max-w-sm animate-in slide-in-from-left",
    bottom: "bottom-0 left-0 w-full animate-in slide-in-from-bottom",
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onMouseDown={onClose}>
      <aside className={cn("absolute bg-[var(--color-bg-surface)] p-5 shadow-[var(--shadow-lg)] duration-300", placement[side])} onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </aside>
    </div>
  )
}
