import { ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function TradeBadge({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Badge
      variant="yellow"
      className={cn("gap-1", className)}
    >
      <ArrowLeftRight className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {compact ? "Trades" : "Open to trades"}
    </Badge>
  );
}
