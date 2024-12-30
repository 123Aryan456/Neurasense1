import { Suspense } from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import Home from "./components/home";
import LandingPage from "./components/landing/LandingPage";
import CodeAnalysisPage from "./components/analysis/CodeAnalysisPage";
import CodeTreePage from "./components/dashboard/pages/CodeTreePage";
import ComplexityPage from "./components/dashboard/pages/ComplexityPage";
import DependencyPage from "./components/dashboard/pages/DependencyPage";
import PerformancePage from "./components/dashboard/pages/PerformancePage";
import SignInPage from "./components/auth/SignInPage";
import SignUpPage from "./components/auth/SignUpPage";
import AuthCallback from "./components/auth/AuthCallback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { DashboardProvider } from "@/lib/dashboardContext";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { useAuth } from "./lib/auth";
import routes from "tempo-routes";

function App() {
  const { session } = useAuth();

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner />
            </div>
          }
        >
          {/* Tempo routes */}
          {import.meta.env.VITE_TEMPO && useRoutes(routes)}

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/signin"
              element={
                session ? <Navigate to="/dashboard" replace /> : <SignInPage />
              }
            />
            <Route
              path="/signup"
              element={
                session ? <Navigate to="/dashboard" replace /> : <SignUpPage />
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <CodeAnalysisPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/code-tree"
              element={
                <ProtectedRoute>
                  <CodeTreePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complexity"
              element={
                <ProtectedRoute>
                  <ComplexityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dependencies"
              element={
                <ProtectedRoute>
                  <DependencyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <PerformancePage />
                </ProtectedRoute>
              }
            />

            {/* Add this before the catchall route */}
            {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}

            {/* Catch all redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </DashboardProvider>
  );
}

export default App;
