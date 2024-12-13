import React from "react";
import { ChevronRight, ChevronDown, FileCode, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WidgetSettings } from "@/components/ui/widget-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/lib/dashboardContext";
import { motion, AnimatePresence } from "framer-motion";

export interface TreeNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
  content?: string;
  size?: number;
}

const defaultData: TreeNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        children: [
          {
            id: "3",
            name: "App.tsx",
            type: "file",
            content: "// React component code",
            size: 1024,
          },
        ],
      },
      {
        id: "4",
        name: "utils",
        type: "folder",
        children: [
          {
            id: "5",
            name: "helpers.ts",
            type: "file",
            content: "// Utility functions",
            size: 512,
          },
        ],
      },
    ],
  },
];

const TreeNode: React.FC<{
  node: TreeNode;
  level?: number;
  settings: {
    showLineNumbers: boolean;
    showFileSizes: boolean;
    expandedByDefault: boolean;
  };
}> = ({ node, level = 0, settings }) => {
  const [isExpanded, setIsExpanded] = React.useState(
    settings.expandedByDefault,
  );
  const { setSelectedNode } = useDashboard();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="text-sm"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`flex items-center gap-1 py-1 px-2 hover:bg-accent rounded-sm cursor-pointer`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => setSelectedNode(node)}
      >
        {node.type === "folder" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={handleToggle}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-3 w-3" />
            </motion.div>
          </Button>
        )}
        {node.type === "folder" ? (
          <Folder className="h-4 w-4 text-muted-foreground" />
        ) : (
          <FileCode className="h-4 w-4 text-muted-foreground" />
        )}
        <span>{node.name}</span>
        {settings.showFileSizes && node.type === "file" && node.size && (
          <span className="ml-auto text-xs text-muted-foreground">
            {(node.size / 1024).toFixed(1)} KB
          </span>
        )}
      </motion.div>
      <AnimatePresence>
        {node.type === "folder" && isExpanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                settings={settings}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CodeTreeWidget = () => {
  const { selectedNode, widgetSettings, updateWidgetSettings, loadingStates } =
    useDashboard();

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-[700px] h-[500px] bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            Code Tree {selectedNode && `- ${selectedNode.name}`}
          </CardTitle>
          <WidgetSettings
            title="Code Tree"
            settings={widgetSettings.codeTree}
            onSettingChange={(key, value) =>
              updateWidgetSettings("codeTree", { [key]: value })
            }
          />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <AnimatePresence>
              {loadingStates.codeTree ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <div className="pl-6 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                defaultData.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    settings={widgetSettings.codeTree}
                  />
                ))
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CodeTreeWidget;
