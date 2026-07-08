import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "mint" | "amber" | "purple" | "pink" | "yellow";
}) {
  const variants = {
    default: "bg-surface-muted text-purple-dark border border-border",
    accent: "bg-pink-soft text-purple-dark",
    mint: "bg-yellow-soft text-purple-dark",
    amber: "bg-yellow text-purple-dark",
    purple: "bg-purple text-white",
    pink: "bg-pink text-purple-dark",
    yellow: "bg-yellow text-purple-dark",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-header font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
