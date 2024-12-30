import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseProvider } from "./lib/supabaseContext";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { TempoDevtools } from "tempo-devtools";

// Initialize Tempo Devtools
TempoDevtools.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SupabaseProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <App />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </SupabaseProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
