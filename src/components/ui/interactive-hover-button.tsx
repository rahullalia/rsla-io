import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-accent/90",
        className
      )}
      {...props}
    >
      {children}
      <ArrowRight size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
    </button>
  )
}
