import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="grid gap-2">
        {label && <label htmlFor={inputId} className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</label>}
        <input
          id={inputId}
          type={type}
          aria-invalid={Boolean(error)}
          className={cn(
            "flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-text-tertiary)] focus-visible:border-[var(--color-border-strong)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--color-danger)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {(error || helperText) && <p className={cn("text-xs", error ? "text-[var(--color-danger)]" : "text-[var(--color-text-secondary)]")}>{error || helperText}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
