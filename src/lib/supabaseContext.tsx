import { createContext, useContext, useEffect, useState } from "react";
import { supabase, checkSupabaseConnection } from "./supabase";

type SupabaseContextType = {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
  isConnected: false,
  isLoading: true,
  error: null,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkSupabaseConnection();
        setIsConnected(connected);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to connect to Supabase"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <SupabaseContext.Provider value={{ isConnected, isLoading, error }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
