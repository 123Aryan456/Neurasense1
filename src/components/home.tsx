import React, { useEffect, useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useDashboard } from "@/lib/dashboardContext";
import { FileCode, Database, Gauge, Settings, Loader2 } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const { metrics, analysisResults, loadingStates } = useDashboard();
  const [stats, setStats] = useState({
    filesAnalyzed: 0,
    tablesCreated: 0,
    performanceScore: 0,
  });

  useEffect(() => {
    if (metrics && analysisResults) {
      const codeTree = metrics.code_tree as any[];
      const filesCount = countFiles(codeTree);
      const performanceMetrics = metrics.performance_metrics as any;

      setStats({
        filesAnalyzed: filesCount,
        tablesCreated: Object.keys(metrics.dependency_graph || {}).length,
        performanceScore: calculatePerformanceScore(performanceMetrics),
      });
    }
  }, [metrics, analysisResults]);

  const countFiles = (tree: any[]): number => {
    if (!Array.isArray(tree)) return 0;
    return tree.reduce((count, item) => {
      if (item.type === "file") return count + 1;
      if (item.children) return count + countFiles(item.children);
      return count;
    }, 0);
  };

  const calculatePerformanceScore = (metrics: any): number => {
    if (!metrics) return 0;
    const scores = [
      metrics.cpu_usage ? 100 - metrics.cpu_usage : 0,
      metrics.memory_usage
        ? 100 - (metrics.memory_usage / metrics.memory_total) * 100
        : 0,
      metrics.response_time ? 100 - (metrics.response_time / 1000) * 100 : 0,
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back, {user?.user_metadata?.name || "Developer"}
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your project's analysis and metrics.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Code Analysis</h3>
                </div>
                {loadingStates.codeTree ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <p className="text-2xl font-bold">{stats.filesAnalyzed}</p>
                    <p className="text-sm text-muted-foreground">
                      Files analyzed
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Dependencies</h3>
                </div>
                {loadingStates.dependency ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <p className="text-2xl font-bold">{stats.tablesCreated}</p>
                    <p className="text-sm text-muted-foreground">
                      Dependencies tracked
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Performance</h3>
                </div>
                {loadingStates.performance ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <p className="text-2xl font-bold">
                      {stats.performanceScore}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Overall score
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Project Info */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">Project Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your project configuration and preferences
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Project Name</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.user_metadata?.project_name || "My Project"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Project Type</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.user_metadata?.project_type || "Python"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user?.created_at || "").toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
