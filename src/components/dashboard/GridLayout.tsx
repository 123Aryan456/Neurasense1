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
import { motion } from "framer-motion";

const GridLayout = () => {
  const { activeSection, analysisResults } = useDashboard();

  const hasAnalysis = !!analysisResults;

  const NoDataMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2"
    >
      <p>No analysis data available</p>
      <p className="text-sm">Run an analysis to see metrics</p>
    </motion.div>
  );

  return (
    <div className="h-full w-full p-6">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[800px] rounded-lg border border-border bg-card/50 backdrop-blur-sm"
      >
        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50} minSize={35}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center p-6 overflow-auto min-w-[350px] min-h-[300px]"
              >
                {hasAnalysis ? <CodeTreeWidget /> : <NoDataMessage />}
              </motion.div>
            </ResizablePanel>
            <ResizableHandle className="bg-border/50 hover:bg-border transition-colors" />
            <ResizablePanel defaultSize={50} minSize={35}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center p-6 overflow-auto min-w-[350px] min-h-[300px]"
              >
                {hasAnalysis ? <ComplexityWidget /> : <NoDataMessage />}
              </motion.div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle className="bg-border/50 hover:bg-border transition-colors" />
        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50} minSize={35}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center p-6 overflow-auto min-w-[350px] min-h-[300px]"
              >
                {hasAnalysis ? <DependencyWidget /> : <NoDataMessage />}
              </motion.div>
            </ResizablePanel>
            <ResizableHandle className="bg-border/50 hover:bg-border transition-colors" />
            <ResizablePanel defaultSize={50} minSize={35}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center p-6 overflow-auto min-w-[350px] min-h-[300px]"
              >
                {hasAnalysis ? <PerformanceWidget /> : <NoDataMessage />}
              </motion.div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default GridLayout;
