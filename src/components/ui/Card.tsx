import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-border overflow-hidden shadow-[0_1px_0_rgba(37,20,47,0.04)]",
        hover && "card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
