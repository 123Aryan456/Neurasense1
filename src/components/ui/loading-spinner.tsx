import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-muted-foreground",
        className,
      )}
      {...props}
    >
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="ml-2 text-sm">Loading...</span>
    </div>
  );
}
