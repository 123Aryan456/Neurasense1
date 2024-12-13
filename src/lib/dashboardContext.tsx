import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import type { TreeNode } from "@/components/dashboard/widgets/CodeTreeWidget";
import { useAuth } from "./auth";
import {
  getProjectMetrics,
  getAnalysisResults,
  subscribeToProjectMetrics,
  subscribeToAnalysisResults,
} from "./projectService";

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
  analysisResults: any;
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
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [widgetSettings, setWidgetSettings] = useState(defaultSettings);
  const [metrics, setMetrics] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    codeTree: true,
    complexity: true,
    dependency: true,
    performance: true,
  });

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        const [metricsData, analysisData] = await Promise.all([
          getProjectMetrics(user.id),
          getAnalysisResults(user.id),
        ]);

        if (mounted.current) {
          setMetrics(metricsData);
          setAnalysisResults(analysisData);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        if (mounted.current) {
          setLoadingStates({
            codeTree: false,
            complexity: false,
            dependency: false,
            performance: false,
          });
        }
      }
    };

    loadData();

    // Subscribe to real-time updates
    const metricsSubscription = subscribeToProjectMetrics(
      user.id,
      (newMetrics) => {
        if (mounted.current) {
          setMetrics(newMetrics);
        }
      },
    );

    const analysisSubscription = subscribeToAnalysisResults(
      user.id,
      (newResults) => {
        if (mounted.current) {
          setAnalysisResults(newResults);
        }
      },
    );

    return () => {
      metricsSubscription.unsubscribe();
      analysisSubscription.unsubscribe();
      mounted.current = false;
    };
  }, [user?.id]);

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
    analysisResults,
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
