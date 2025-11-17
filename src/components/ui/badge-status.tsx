import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "open" | "in_progress" | "resolved";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    open: "bg-info text-info-foreground hover:bg-info/90",
    in_progress: "bg-warning text-warning-foreground hover:bg-warning/90",
    resolved: "bg-success text-success-foreground hover:bg-success/90",
  };

  const labels = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
  };

  return (
    <Badge className={cn(variants[status], className)}>
      {labels[status]}
    </Badge>
  );
}
