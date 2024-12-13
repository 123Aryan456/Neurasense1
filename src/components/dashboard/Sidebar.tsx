import React, { memo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileCode,
  LineChart,
  Network,
  Gauge,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "./sidebar/ThemeToggle";

interface SidebarProps {
  onThemeToggle?: () => void;
  isDark?: boolean;
}

const navigationItems = [
  {
    id: "home",
    icon: LayoutDashboard,
    label: "Overview",
    path: "/dashboard",
  },
  { id: "analyze", icon: Play, label: "Analyze Code", path: "/analyze" },
  { id: "code-tree", icon: FileCode, label: "Code Tree", path: "/code-tree" },
  {
    id: "complexity",
    icon: LineChart,
    label: "Code Complexity",
    path: "/complexity",
  },
  {
    id: "dependencies",
    icon: Network,
    label: "Dependencies",
    path: "/dependencies",
  },
  {
    id: "performance",
    icon: Gauge,
    label: "Performance",
    path: "/performance",
  },
] as const;

const NavigationItem = memo(
  ({
    item,
    isActive,
    onClick,
    showLabels,
  }: {
    item: (typeof navigationItems)[number];
    isActive: boolean;
    onClick: () => void;
    showLabels: boolean;
  }) => (
    <Button
      variant="ghost"
      className={`w-full h-10 justify-start gap-4 rounded-md relative overflow-hidden transition-all duration-300 ${isActive ? "bg-primary/10" : "hover:bg-primary/5"}`}
      onClick={onClick}
    >
      <item.icon
        className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}
      />
      <span
        className={`text-sm transition-all duration-200 ${showLabels ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"} ${isActive ? "text-primary" : "text-muted-foreground"}`}
      >
        {item.label}
      </span>
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
      )}
    </Button>
  ),
);

const Sidebar = ({ onThemeToggle = () => {}, isDark = true }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (item: (typeof navigationItems)[number]) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const isItemActive = (item: (typeof navigationItems)[number]) => {
    return location.pathname === item.path;
  };

  return (
    <div
      className={`h-full bg-background border-r border-border flex flex-col py-4 gap-4 relative transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-16"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col items-stretch px-2 gap-2">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={isItemActive(item)}
            onClick={() => handleClick(item)}
            showLabels={isExpanded}
          />
        ))}

        <Separator className="my-4" />

        <div
          className={`flex ${isExpanded ? "justify-start px-2" : "justify-center"}`}
        >
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
