import { Button } from "@/components/ui/button"

export function EmptyState({ icon, title, description, action }: { icon?: React.ReactNode; title: string; description?: string; action?: { label: string; href?: string; onClick?: () => void } }) {
  return (
    <div className="empty-state">
      {icon && <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)]">{icon}</div>}
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm">{description}</p>}
      {action && <Button className="mt-5" onClick={action.onClick} asChild={Boolean(action.href)}>{action.href ? <a href={action.href}>{action.label}</a> : action.label}</Button>}
    </div>
  )
}

export function ErrorState({ message = "Something went wrong", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="empty-state">
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{message}</h3>
      <p className="mt-2 text-sm">Please try again. If it keeps failing, check that the backend server is running.</p>
      {onRetry && <Button className="mt-5" variant="secondary" onClick={onRetry}>Try again</Button>}
    </div>
  )
}
