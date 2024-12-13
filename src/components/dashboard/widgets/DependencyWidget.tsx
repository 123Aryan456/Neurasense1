import React from "react";
import { Network, ArrowRight, FileCode } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WidgetSettings } from "@/components/ui/widget-settings";
import { useDashboard } from "@/lib/dashboardContext";
import { Skeleton } from "@/components/ui/skeleton";

interface DependencyNode {
  id: string;
  name: string;
  type: "component" | "module" | "package";
  dependencies: string[];
  details?: string;
}

interface DependencyWidgetProps {
  dependencies?: DependencyNode[];
  onNodeClick?: (node: DependencyNode) => void;
}

const DependencyWidget = ({
  onNodeClick = () => {},
}: DependencyWidgetProps) => {
  const {
    widgetSettings,
    updateWidgetSettings,
    loadingStates,
    analysisResults,
  } = useDashboard();
  const settings = widgetSettings.dependency;

  if (!analysisResults?.dependency_graph) return null;

  const dependencies = analysisResults.dependency_graph as DependencyNode[];

  const groupedDependencies = settings.groupByType
    ? dependencies.reduce(
        (acc, dep) => {
          if (!acc[dep.type]) acc[dep.type] = [];
          acc[dep.type].push(dep);
          return acc;
        },
        {} as Record<string, DependencyNode[]>,
      )
    : { all: dependencies };

  return (
    <Card className="w-[600px] h-[450px] bg-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Dependencies
          </div>
        </CardTitle>
        <WidgetSettings
          title="Dependencies"
          settings={settings}
          onSettingChange={(key, value) =>
            updateWidgetSettings("dependency", { [key]: value })
          }
        />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          {loadingStates.dependency ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <div className="p-3 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedDependencies).map(([type, deps]) => (
                <div key={type} className="space-y-4">
                  {settings.groupByType && (
                    <h3 className="text-sm font-medium capitalize">{type}</h3>
                  )}
                  {deps.map((node) => (
                    <div
                      key={node.id}
                      className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                      onClick={() => onNodeClick(node)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{node.name}</span>
                        </div>
                        {settings.showTypes && (
                          <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                            {node.type}
                          </span>
                        )}
                      </div>
                      {settings.showDetails && node.details && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {node.details}
                        </p>
                      )}
                      {node.dependencies.length > 0 && (
                        <div className="pl-6 space-y-2">
                          {node.dependencies.map((depId) => {
                            const dep = dependencies.find(
                              (d) => d.id === depId,
                            );
                            return (
                              dep && (
                                <div
                                  key={depId}
                                  className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                  <ArrowRight className="h-3 w-3" />
                                  <span>{dep.name}</span>
                                  {settings.showTypes && (
                                    <span className="text-xs px-1.5 py-0.5 bg-secondary rounded-full">
                                      {dep.type}
                                    </span>
                                  )}
                                </div>
                              )
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DependencyWidget;
