import React from "react";
import Sidebar from "./dashboard/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/dashboardContext";
import { FileCode, Database, Gauge, Settings } from "lucide-react";

const Home = () => {
  const { metrics, analysisResults, loadingStates } = useDashboard();

  const stats = {
    filesAnalyzed: 42,
    tablesCreated: 8,
    performanceScore: 95,
  };

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to NeuraSense
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
                <p className="text-2xl font-bold">{stats.filesAnalyzed}</p>
                <p className="text-sm text-muted-foreground">Files analyzed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Dependencies</h3>
                </div>
                <p className="text-2xl font-bold">{stats.tablesCreated}</p>
                <p className="text-sm text-muted-foreground">
                  Dependencies tracked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Performance</h3>
                </div>
                <p className="text-2xl font-bold">{stats.performanceScore}%</p>
                <p className="text-sm text-muted-foreground">Overall score</p>
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
                  <p className="text-sm text-muted-foreground">NeuraSense</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Project Type</p>
                  <p className="text-sm text-muted-foreground">Python</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm text-muted-foreground">Demo User</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
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
