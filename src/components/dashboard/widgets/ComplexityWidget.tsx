import React from "react";
import { LineChart, ArrowUp, ArrowDown, Code2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WidgetSettings } from "@/components/ui/widget-settings";
import { useDashboard } from "@/lib/dashboardContext";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface ComplexityMetric {
  name: string;
  value: number;
  change: number;
  maxValue: number;
}

interface ComplexityWidgetProps {
  metrics?: ComplexityMetric[];
}

const ComplexityWidget = ({ metrics }: ComplexityWidgetProps) => {
  const {
    widgetSettings,
    updateWidgetSettings,
    loadingStates,
    analysisResults,
  } = useDashboard();
  const settings = widgetSettings.complexity;

  if (!analysisResults?.complexity_metrics) return null;

  const complexityData = analysisResults.complexity_metrics as any;
  const currentMetrics: ComplexityMetric[] = [
    {
      name: "Cyclomatic Complexity",
      value: complexityData.cyclomaticComplexity || 0,
      change: 0,
      maxValue: 30,
    },
    {
      name: "Cognitive Complexity",
      value: complexityData.cognitiveComplexity || 0,
      change: 0,
      maxValue: 40,
    },
    {
      name: "Maintainability Index",
      value: complexityData.maintainabilityIndex || 0,
      change: 0,
      maxValue: 100,
    },
    {
      name: "Lines of Code",
      value: complexityData.linesOfCode || 0,
      change: 0,
      maxValue: 1000,
    },
  ];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-[500px] h-[400px] bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Code Complexity
            </div>
          </CardTitle>
          <WidgetSettings
            title="Complexity"
            settings={settings}
            onSettingChange={(key, value) =>
              updateWidgetSettings("complexity", { [key]: value })
            }
          />
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            <div className="space-y-6">
              {loadingStates.complexity ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </motion.div>
              ) : (
                currentMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {metric.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.span
                          key={metric.value}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm font-medium"
                        >
                          {metric.value}
                          {settings.showPercentages &&
                            ` (${((metric.value / metric.maxValue) * 100).toFixed(1)}%)`}
                        </motion.span>
                      </div>
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Progress
                        value={(metric.value / metric.maxValue) * 100}
                        className="h-2"
                      />
                    </motion.div>
                    {settings.showThresholds && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-between text-xs text-muted-foreground"
                      >
                        <span>0</span>
                        <span>{metric.maxValue}</span>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComplexityWidget;
