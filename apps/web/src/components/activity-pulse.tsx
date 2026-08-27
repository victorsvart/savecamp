import { cn } from "@/lib/utils";
import { useActivity } from "@/contexts/activity-context";

export function ActivityPulse({ className }: { className?: string }) {
  const { status, message } = useActivity();
  const isActive = status === "active";

  return (
    <p
      className={cn(
        "min-w-0 truncate text-xs tabular-nums",
        isActive ? "text-foreground" : "text-muted-foreground",
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </p>
  );
}
