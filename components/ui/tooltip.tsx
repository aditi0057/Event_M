export function Tooltip({ content, children }: { content: string; position?: "top" | "bottom" | "left" | "right"; children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-2 py-1 text-xs text-white group-hover:block">
        {content}
      </span>
    </span>
  )
}
