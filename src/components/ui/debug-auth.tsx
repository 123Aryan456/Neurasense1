import { useAuth } from "@/lib/auth";
import { Button } from "./button";
import { supabase } from "@/lib/supabase";

export function DebugAuth() {
  const { session, user } = useAuth();

  const checkConnection = async () => {
    console.log("Checking Supabase connection...");
    console.log("Environment:", {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY:
        import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 10) + "...",
    });

    try {
      const { data, error } = await supabase.auth.getSession();
      console.log("Auth check result:", { data, error });
    } catch (err) {
      console.error("Auth check error:", err);
    }
  };

  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={checkConnection}>
          Check Auth
        </Button>
      </div>
    );
  }

  return null;
}
