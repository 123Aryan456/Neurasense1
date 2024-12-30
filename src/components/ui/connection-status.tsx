import { useSupabase } from "@/lib/supabaseContext";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export function ConnectionStatus() {
  const { isConnected, isLoading, error } = useSupabase();

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-destructive" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isConnected
              ? "Connected to Supabase"
              : error
                ? `Connection error: ${error.message}`
                : "Not connected to Supabase"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
