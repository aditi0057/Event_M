"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastItem = { id: number; message: string; type: "success" | "error" | "warning" | "info" }
const ToastContext = createContext<{ toast: (message: string, type?: ToastItem["type"]) => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const toast = useCallback((message: string, type: ToastItem["type"] = "info") => {
    const id = Date.now()
    setItems((current) => [...current, { id, message, type }])
    window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 4000)
  }, [])
  const value = useMemo(() => ({ toast }), [toast])
  const colors = {
    success: "border-[var(--color-success)] bg-[var(--color-success-bg)] text-[var(--color-success)]",
    error: "border-[var(--color-danger)] bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
    warning: "border-[var(--color-warning)] bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
    info: "border-[var(--color-info)] bg-[var(--color-info-bg)] text-[var(--color-info)]",
  }
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] grid w-[min(360px,calc(100vw-32px))] gap-2">
        {items.map((item) => (
          <div key={item.id} className={cn("flex items-start justify-between gap-3 rounded-[var(--radius-md)] border p-3 text-sm shadow-[var(--shadow-md)]", colors[item.type])}>
            <span>{item.message}</span>
            <button onClick={() => setItems((current) => current.filter((toast) => toast.id !== item.id))}><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) return { toast: () => undefined }
  return context
}
