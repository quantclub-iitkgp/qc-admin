import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-base border-2 border-border px-2.5 py-0.5 text-xs font-base transition-colors",
  {
    variants: {
      variant: {
        default: "bg-main text-main-foreground",
        secondary: "bg-secondary-background text-foreground",
        destructive: "bg-red-500 text-white",
        outline: "bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
