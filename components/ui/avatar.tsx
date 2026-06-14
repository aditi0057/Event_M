import { cn } from "@/lib/utils"

const sizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-14 w-14 text-base",
}

export type AvatarUser = { name?: string; fullname?: string; avatar?: string; src?: string }

export function Avatar({ src, name, size = "md", className }: { src?: string; name?: string; size?: keyof typeof sizes; className?: string }) {
  const initials = (name || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-accent-light)] font-semibold text-[var(--color-accent)]", sizes[size], className)}>
      {src ? <img src={src} alt={name || "User"} className="h-full w-full object-cover" /> : initials}
    </span>
  )
}

export function AvatarGroup({ users, max = 3 }: { users: AvatarUser[]; max?: number }) {
  const shown = users.slice(0, max)
  const remaining = users.length - shown.length
  return (
    <div className="flex -space-x-2">
      {shown.map((user, index) => (
        <Avatar key={`${user.name || user.fullname || "user"}-${index}`} src={user.src || user.avatar} name={user.name || user.fullname} size="sm" className="ring-2 ring-white" />
      ))}
      {remaining > 0 && <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-xs font-semibold text-[var(--color-text-secondary)] ring-2 ring-white">+{remaining}</span>}
    </div>
  )
}
