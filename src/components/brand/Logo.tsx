import { cn } from "@/lib/utils";
import { bodyFont } from "@/lib/fonts";

export function Logo({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        bodyFont.className,
        "text-[1.65rem] font-semibold lowercase leading-none tracking-[-0.015em] sm:text-[1.95rem]",
        light ? "text-white" : "text-purple-dark",
        className
      )}
    >
      luomus
    </span>
  );
}
