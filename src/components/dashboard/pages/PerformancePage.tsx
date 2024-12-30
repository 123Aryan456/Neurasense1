import React from "react";
import Sidebar from "../Sidebar";
import PerformanceWidget from "../widgets/PerformanceWidget";
import { useDashboard } from "@/lib/dashboardContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileCode } from "lucide-react";

const PerformancePage = () => {
  const { analysisResults } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {analysisResults ? (
            <PerformanceWidget />
          ) : (
            <Card className="p-6 text-center space-y-4">
              <p className="text-muted-foreground">
                No analysis data available. Run an analysis to see performance
                metrics.
              </p>
              <Button onClick={() => navigate("/analyze")} className="gap-2">
                <FileCode className="h-4 w-4" />
                Analyze Code
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default PerformancePage;
