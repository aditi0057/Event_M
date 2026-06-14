import { cn } from "@/lib/utils"

export function Tabs({ items, activeTab, onChange }: { items: string[]; activeTab: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button key={item} onClick={() => onChange(item)} className={cn("rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]", activeTab === item ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-surface-0)] text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)] hover:text-[var(--color-text-primary)]")}>
          {item}
        </button>
      ))}
    </div>
  )
}
