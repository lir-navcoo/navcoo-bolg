import * as React from "react"
import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "vertical" | "horizontal" | "both" }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative overflow-hidden",
      orientation === "vertical" && "flex flex-col",
      orientation === "horizontal" && "flex flex-row",
      className
    )}
    {...props}
  >
    <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
      {props.children}
    </div>
  </div>
))
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
