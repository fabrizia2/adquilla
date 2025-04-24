"use client"

import { forwardRef } from "react"
import { cn } from "../../lib/utils"

const Checkbox = forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          className,
        )}
        {...props}
      />
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 h-4 w-4 stroke-white"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export { Checkbox }
