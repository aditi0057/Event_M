import { cn } from "@/lib/utils"

export function ProgressBar({ value, max = 100, color = "accent", animated = false }: { value: number; max?: number; color?: "accent" | "success" | "warning" | "danger"; animated?: boolean }) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const colors = {
    accent: "bg-[var(--color-accent)]",
    success: "bg-[var(--color-success)]",
    warning: "bg-[var(--color-warning)]",
    danger: "bg-[var(--color-danger)]",
  }
  return <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]"><div className={cn("h-full rounded-full transition-all", colors[color], animated && "duration-500")} style={{ width: `${percentage}%` }} /></div>
}
