"use client"

import { forwardRef, createContext, useContext, useState } from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "../../components/icons"

const SelectContext = createContext({})

const Select = ({ children, value, onValueChange, ...props }) => {
  const [open, setOpen] = useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen, value } = useContext(SelectContext)

  return (
    <button
      ref={ref}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = forwardRef(({ className, placeholder, ...props }, ref) => {
  const { value } = useContext(SelectContext)

  return (
    <span className={cn("flex-1 text-left", className)} {...props}>
      {value || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

const SelectContent = forwardRef(({ className, children, ...props }, ref) => {
  const { open } = useContext(SelectContext)

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        className,
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = forwardRef(({ className, children, value: itemValue, ...props }, ref) => {
  const { value, onValueChange, setOpen } = useContext(SelectContext)

  const isSelected = value === itemValue

  const handleClick = () => {
    onValueChange(itemValue)
    setOpen(false)
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected ? "bg-accent text-accent-foreground" : "",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
      <span className="flex-1">{children}</span>
    </div>
  )
})
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
