import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeTreeWidget from "./widgets/CodeTreeWidget";
import ComplexityWidget from "./widgets/ComplexityWidget";
import DependencyWidget from "./widgets/DependencyWidget";
import PerformanceWidget from "./widgets/PerformanceWidget";
import { useDashboard } from "@/lib/dashboardContext";

const GridLayout = () => {
  const { activeSection, analysisResults } = useDashboard();

  const hasAnalysis = !!analysisResults;

  const NoDataMessage = () => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
      <p>No analysis data available</p>
      <p className="text-sm">Run an analysis to see metrics</p>
    </div>
  );

  return (
    <div className="h-full w-full p-6">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[800px] rounded-lg border border-border"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50} minSize={35}>
              <div className="flex items-center justify-center p-6 overflow-auto min-w-[350px] min-h-[300px]">
                {hasAnalysis ? <CodeTreeWidget /> : <NoDataMessage />}
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} minSize={35}>
              <div className="flex items-center justify-center p-6 overflow-auto min-w-[350px] min-h-[300px]">
                {hasAnalysis ? <ComplexityWidget /> : <NoDataMessage />}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50} minSize={35}>
              <div className="flex items-center justify-center p-6 overflow-auto min-w-[350px] min-h-[300px]">
                {hasAnalysis ? <DependencyWidget /> : <NoDataMessage />}
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} minSize={35}>
              <div className="flex items-center justify-center p-6 overflow-auto min-w-[350px] min-h-[300px]">
                {hasAnalysis ? <PerformanceWidget /> : <NoDataMessage />}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default GridLayout;
