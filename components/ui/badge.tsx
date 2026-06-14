import { cn } from "@/lib/utils"

const badgeStyles: Record<string, string> = {
  festival: "bg-[var(--category-festival-bg)] text-[var(--category-festival)]",
  birthday: "bg-[var(--category-birthday-bg)] text-[var(--category-birthday)]",
  work: "bg-[var(--category-work-bg)] text-[var(--category-work)]",
  sports: "bg-[var(--category-sports-bg)] text-[var(--category-sports)]",
  other: "bg-[var(--category-other-bg)] text-[var(--category-other)]",
  success: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  danger: "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
  warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  info: "bg-[var(--color-info-bg)] text-[var(--color-info)]",
}

export function Badge({ color = "other", className, children }: { color?: string; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-1 text-xs font-semibold", badgeStyles[color.toLowerCase()] || badgeStyles.other, className)}>
      {children}
    </span>
  )
}
