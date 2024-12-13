import React from "react";
import {
  Gauge,
  ArrowUp,
  ArrowDown,
  Clock,
  Cpu,
  HardDrive,
  Activity,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WidgetSettings } from "@/components/ui/widget-settings";
import { useDashboard } from "@/lib/dashboardContext";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  icon: keyof typeof metricIcons;
  threshold: number;
  history?: { timestamp: number; value: number }[];
}

interface PerformanceWidgetProps {
  metrics?: PerformanceMetric[];
}

const metricIcons = {
  cpu: Cpu,
  memory: HardDrive,
  latency: Clock,
  throughput: Activity,
};

const PerformanceWidget = () => {
  const {
    widgetSettings,
    updateWidgetSettings,
    loadingStates,
    analysisResults,
  } = useDashboard();
  const settings = widgetSettings.performance;

  if (!analysisResults?.performance_metrics) return null;

  const performanceData = analysisResults.performance_metrics as any;
  const currentMetrics: PerformanceMetric[] = [
    {
      name: "CPU Usage",
      value: performanceData.cpu_usage || 0,
      unit: "%",
      change: 0,
      icon: "cpu",
      threshold: 100,
    },
    {
      name: "Memory Usage",
      value: performanceData.memory_usage || 0,
      unit: "MB",
      change: 0,
      icon: "memory",
      threshold: performanceData.memory_total || 1000,
    },
    {
      name: "Response Time",
      value: performanceData.response_time || 0,
      unit: "ms",
      change: 0,
      icon: "latency",
      threshold: 1000,
    },
    {
      name: "Requests/sec",
      value: performanceData.requests_per_second || 0,
      unit: "req/s",
      change: 0,
      icon: "throughput",
      threshold: 1000,
    },
  ];

  return (
    <Card className="w-[500px] h-[350px] bg-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Performance Metrics
          </div>
        </CardTitle>
        <WidgetSettings
          title="Performance"
          settings={settings}
          onSettingChange={(key, value) =>
            updateWidgetSettings("performance", { [key]: value })
          }
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loadingStates.performance ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          ) : (
            currentMetrics.map((metric) => {
              const Icon = metricIcons[metric.icon];
              const progressValue = (metric.value / metric.threshold) * 100;
              const isOverThreshold = progressValue > 80;

              return (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {metric.value} {metric.unit}
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={progressValue}
                    className={`h-2 ${isOverThreshold ? "bg-red-200" : ""}`}
                  />
                  {settings.showThresholds && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>{metric.threshold}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceWidget;
