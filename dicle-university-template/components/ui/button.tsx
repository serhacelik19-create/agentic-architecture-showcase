import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Note: We are simulating cva behavior or simplifiying it if 'class-variance-authority' is not installed.
// Since I cannot check if user installed 'class-variance-authority', I will write a robust version using standard props
// but designed to look like the shadcn/ui standard for future compatibility.

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary"
    size?: "default" | "sm" | "lg" | "icon"
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {

        // Base styles
        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

        // Variants
        const variants = {
            default: "bg-black text-white hover:bg-black/90 dark:bg-slate-50 dark:text-slate-900",
            primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 shadow-md",
            destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
            outline: "border border-[var(--input)] bg-background hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
            secondary: "bg-[var(--secondary)] text-white hover:bg-[var(--secondary)]/80",
            ghost: "hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)]",
            link: "text-primary underline-offset-4 hover:underline",
        }

        // Sizes
        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        }

        const Comp = "button"

        return (
            <Comp
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
