import React, { createContext, useContext, useState, useEffect } from "react";
import type { TreeNode } from "@/components/dashboard/widgets/CodeTreeWidget";
import { useAuth } from "./auth";
import {
  getCurrentProject,
  subscribeToProjectUpdates,
  createProject,
} from "./projectService";
import { supabase } from "./supabase";
import { toast } from "@/components/ui/use-toast";

interface WidgetSettings {
  showLineNumbers: boolean;
  showFileSizes: boolean;
  expandedByDefault: boolean;
}

interface ComplexitySettings {
  showTrends: boolean;
  showThresholds: boolean;
  showPercentages: boolean;
}

interface DependencySettings {
  showTypes: boolean;
  showDetails: boolean;
  groupByType: boolean;
}

interface PerformanceSettings {
  showRealTime: boolean;
  showAlerts: boolean;
  showThresholds: boolean;
}

interface DashboardContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedNode: TreeNode | null;
  setSelectedNode: (node: TreeNode | null) => void;
  widgetSettings: {
    codeTree: WidgetSettings;
    complexity: ComplexitySettings;
    dependency: DependencySettings;
    performance: PerformanceSettings;
  };
  loadingStates: LoadingState;
  metrics: any;
  setMetrics: (metrics: any) => void;
  analysisResults: any;
  setAnalysisResults: (results: any) => void;
  updateWidgetSettings: (
    widget: keyof DashboardContextType["widgetSettings"],
    settings: Partial<
      | WidgetSettings
      | ComplexitySettings
      | DependencySettings
      | PerformanceSettings
    >,
  ) => void;
}

interface LoadingState {
  [key: string]: boolean;
}

const defaultSettings = {
  codeTree: {
    showLineNumbers: true,
    showFileSizes: true,
    expandedByDefault: false,
  },
  complexity: {
    showTrends: true,
    showThresholds: true,
    showPercentages: true,
  },
  dependency: {
    showTypes: true,
    showDetails: true,
    groupByType: false,
  },
  performance: {
    showRealTime: true,
    showAlerts: true,
    showThresholds: true,
  },
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [widgetSettings, setWidgetSettings] = useState(defaultSettings);
  const [metrics, setMetrics] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    codeTree: false,
    complexity: false,
    dependency: false,
    performance: false,
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    const initializeDashboard = async () => {
      try {
        let project = await getCurrentProject();

        // If no project exists, create one
        if (!project) {
          project = await createProject({
            name: "My Project",
            type: "python",
            settings: {
              theme: "dark",
              notifications: true,
            },
          });
        }

        // Get latest analysis results
        const { data: latestAnalysis } = await supabase
          .from("analysis_results")
          .select("*")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (latestAnalysis) {
          setAnalysisResults(latestAnalysis);
        }

        // Get latest metrics
        const { data: latestMetrics } = await supabase
          .from("project_metrics")
          .select("*")
          .eq("project_id", project.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (latestMetrics) {
          setMetrics(latestMetrics);
        }

        const cleanup = subscribeToProjectUpdates(
          project.id,
          (analysisData) => {
            setAnalysisResults(analysisData);
            toast({
              title: "Analysis Updated",
              description: "New analysis results available",
            });
          },
          (metricsData) => {
            setMetrics(metricsData);
            toast({
              title: "Metrics Updated",
              description: "Project metrics have been updated",
            });
          },
        );

        return cleanup;
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    };

    initializeDashboard();
  }, [session?.user?.id]);

  const updateWidgetSettings = (
    widget: keyof typeof widgetSettings,
    settings: Partial<(typeof widgetSettings)[typeof widget]>,
  ) => {
    setWidgetSettings((prev) => ({
      ...prev,
      [widget]: { ...prev[widget], ...settings },
    }));
  };

  const value = {
    activeSection,
    setActiveSection,
    selectedNode,
    setSelectedNode,
    widgetSettings,
    loadingStates,
    metrics,
    setMetrics,
    analysisResults,
    setAnalysisResults,
    updateWidgetSettings,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
