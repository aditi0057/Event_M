import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  charLimit?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, charLimit, id, value, ...props }, ref) => {
    const count = typeof value === "string" ? value.length : 0
    const textareaId = id || props.name
    return (
      <div className="grid gap-2">
        {label && <label htmlFor={textareaId} className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</label>}
        <textarea
          id={textareaId}
          value={value}
          maxLength={charLimit}
          aria-invalid={Boolean(error)}
          className={cn(
            "flex min-h-[120px] w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--color-danger)]",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="flex items-center justify-between gap-3">
          {(error || helperText) && <p className={cn("text-xs", error ? "text-[var(--color-danger)]" : "text-[var(--color-text-secondary)]")}>{error || helperText}</p>}
          {charLimit && <p className="ml-auto text-xs text-[var(--color-text-tertiary)]">{count}/{charLimit}</p>}
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
