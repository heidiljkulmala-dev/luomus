import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "pink" | "yellow" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const PRIMARY_CTA_COLORS = "bg-purple-dark text-white shadow-sm hover:bg-purple";

const variants: Record<Variant, string> = {
  primary: PRIMARY_CTA_COLORS,
  secondary:
    "border border-purple-dark/20 bg-white text-purple-dark shadow-sm hover:border-purple-dark/35 hover:bg-purple-soft/60",
  pink: PRIMARY_CTA_COLORS,
  yellow: PRIMARY_CTA_COLORS,
  ghost: "bg-transparent text-purple-dark hover:bg-purple-soft/80",
  outline:
    "border border-purple-dark/20 bg-white text-purple-dark shadow-sm hover:border-purple-dark/35 hover:bg-purple-soft/60",
};

const sizes: Record<Size, string> = {
  sm: "rounded-md px-3 py-2 text-sm",
  md: "h-10 rounded-md px-4 text-sm",
  lg: "h-12 rounded-md px-6 text-base",
};

export const LARGE_CTA_PATTERN =
  `inline-flex items-center justify-center gap-2 font-header text-sm font-semibold tracking-[-0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${PRIMARY_CTA_COLORS} h-12 rounded-md px-6 text-base`;

export const SMALL_CHIP_PATTERN =
  "inline-flex items-center gap-2 rounded-md border border-purple-dark/20 bg-white/90 px-3 py-2 text-sm text-purple-dark transition-colors font-header hover:border-purple-dark/35 hover:bg-purple-soft/60";

export const SMALL_CHIP_ACTIVE_PATTERN =
  "border-purple-dark bg-purple-dark text-white shadow-sm hover:border-purple-dark hover:bg-purple-dark";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-header text-sm font-semibold tracking-[-0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
