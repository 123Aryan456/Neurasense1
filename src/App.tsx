import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import PricingPage from "./components/landing/PricingPage";
import LandingPage from "./components/landing/LandingPage";
import OnboardingPage from "./components/onboarding/OnboardingPage";
import SignInPage from "./components/auth/SignInPage";
import CodeAnalysisPage from "./components/analysis/CodeAnalysisPage";
import CodeTreePage from "./components/dashboard/pages/CodeTreePage";
import ComplexityPage from "./components/dashboard/pages/ComplexityPage";
import DependencyPage from "./components/dashboard/pages/DependencyPage";
import PerformancePage from "./components/dashboard/pages/PerformancePage";
import { DashboardProvider } from "@/lib/dashboardContext";
import { useAuth } from "@/lib/auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <p>Loading...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
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
          </Routes>
        </Suspense>
      </div>
    </DashboardProvider>
  );
}

export default App;
