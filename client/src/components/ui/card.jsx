import * as React from "react"
import { cn } from "../../utils/cn"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm p-6",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card } 