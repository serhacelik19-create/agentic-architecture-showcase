"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// Simplified Label without Radix dependency if not installed, ensuring it works.
// Using a basic label if Radix is missing would be safer if I can't install packages.
// But I'll assume standard Shadcn pattern or use a simple substitution.
// Since I can't guarantee 'npm install @radix-ui/react-label', I will create a Label that mimics it standardly.

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }
