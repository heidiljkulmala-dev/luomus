import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "pink" | "yellow" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-purple-dark text-white hover:bg-purple",
  secondary: "bg-purple text-white hover:bg-purple-dark",
  pink: "bg-pink text-purple-dark hover:bg-pink-light",
  yellow: "bg-yellow text-purple-dark ring-1 ring-yellow/30 hover:bg-yellow-soft",
  ghost: "bg-transparent text-purple-dark hover:bg-purple-soft",
  outline: "border border-purple-dark/20 text-purple-dark hover:border-purple-dark hover:bg-white",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-header font-semibold tracking-[-0.01em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
