import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-btn-primary-bg)] text-[var(--color-btn-primary-text)] hover:brightness-95",
        primary: "bg-[var(--color-btn-primary-bg)] text-[var(--color-btn-primary-text)] hover:brightness-95",
        destructive: "bg-[var(--color-danger)] text-white hover:brightness-95",
        danger: "bg-[var(--color-danger)] text-white hover:brightness-95",
        outline: "border border-[var(--color-border-strong)] bg-[var(--color-surface-0)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]",
        secondary: "border border-[var(--color-btn-secondary-border)] bg-[var(--color-btn-secondary-bg)] text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-hover)]",
        ghost: "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]",
        link: "text-[var(--color-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        md: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
