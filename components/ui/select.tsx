"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SelectOption = { label: string; value: string }

export function Select({ label, options, value, onChange, error, className }: { label?: string; options: SelectOption[]; value: string; onChange: (value: string) => void; error?: string; className?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      {label && <label className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</label>}
      <div className="relative">
        <select value={value} onChange={(event) => onChange(event.target.value)} className={cn("h-11 w-full appearance-none rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-3 pr-10 text-sm text-[var(--color-text-primary)] focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]", error && "border-[var(--color-danger)]")}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
      </div>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  )
}
