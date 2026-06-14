"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Modal({ title, open, onClose, size = "md", children }: { title?: string; open: boolean; onClose: () => void; size?: "sm" | "md" | "lg"; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null
  const widths = { sm: "max-w-sm", md: "max-w-xl", lg: "max-w-3xl" }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6" onMouseDown={onClose}>
      <div className={cn("max-h-[100dvh] w-full overflow-auto border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-lg)] sm:rounded-[var(--radius-lg)]", widths[size], "animate-in fade-in-0 slide-in-from-bottom-4 duration-200")} onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between gap-4">
          {title && <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">{title}</h2>}
          <button onClick={onClose} className="ml-auto rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
