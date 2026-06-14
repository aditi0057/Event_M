import { cn } from "@/lib/utils"

export function Skeleton({ variant = "rect", width, height, className }: { variant?: "text" | "circle" | "rect"; width?: number | string; height?: number | string; className?: string }) {
  return (
    <span
      className={cn("block animate-pulse bg-[linear-gradient(90deg,#edeef2,#f7f8fa,#edeef2)] bg-[length:200%_100%]", variant === "circle" ? "rounded-full" : "rounded-[var(--radius-sm)]", variant === "text" && "h-3", className)}
      style={{ width, height }}
    />
  )
}

export function EventCardSkeleton() {
  return <div className="surface overflow-hidden"><Skeleton height={180} /><div className="grid gap-4 p-5"><Skeleton width="40%" height={18} /><Skeleton width="80%" height={24} /><Skeleton width="55%" height={14} /></div></div>
}

export function PollCardSkeleton() {
  return <div className="surface grid gap-4 p-5"><Skeleton width="70%" height={22} /><Skeleton height={12} /><Skeleton height={12} /><Skeleton width="30%" height={14} /></div>
}

export function GalleryItemSkeleton() {
  return <Skeleton className="aspect-[4/3] w-full" />
}

export function CalendarSkeleton() {
  return <div className="grid grid-cols-7 gap-2">{Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} height={86} />)}</div>
}
