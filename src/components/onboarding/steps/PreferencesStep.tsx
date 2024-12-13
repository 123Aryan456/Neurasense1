import React from "react";
import { Preferences } from "../OnboardingPage";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface PreferencesStepProps {
  preferences: Preferences;
  onUpdate: (preferences: Preferences) => void;
}

const analysisOptions = [
  { id: "complexity", label: "Code Complexity Analysis" },
  { id: "security", label: "Security Vulnerability Scanning" },
  { id: "style", label: "Style & Best Practices Check" },
  { id: "documentation", label: "Documentation Analysis" },
];

const visualizationOptions = [
  { id: "dependency", label: "Dependency Graphs" },
  { id: "complexity", label: "Complexity Heatmaps" },
  { id: "performance", label: "Performance Metrics" },
  { id: "tree", label: "Code Tree Visualization" },
];

const PreferencesStep = ({ preferences, onUpdate }: PreferencesStepProps) => {
  const toggleAnalysis = (id: string) => {
    const current = preferences.analysisTypes || [];
    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    onUpdate({ ...preferences, analysisTypes: updated });
  };

  const toggleVisualization = (id: string) => {
    const current = preferences.visualizationPreferences || [];
    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    onUpdate({ ...preferences, visualizationPreferences: updated });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Analysis Preferences
        </h2>
        <p className="text-muted-foreground">
          Customize your code analysis experience
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Analysis Types</Label>
          {analysisOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`analysis-${option.id}`}
                checked={
                  preferences.analysisTypes?.includes(option.id) || false
                }
                onCheckedChange={() => toggleAnalysis(option.id)}
              />
              <Label htmlFor={`analysis-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Label>Visualization Preferences</Label>
          {visualizationOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`viz-${option.id}`}
                checked={
                  preferences.visualizationPreferences?.includes(option.id) ||
                  false
                }
                onCheckedChange={() => toggleVisualization(option.id)}
              />
              <Label htmlFor={`viz-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="notifications"
            checked={preferences.notifications}
            onCheckedChange={(checked) =>
              onUpdate({ ...preferences, notifications: checked })
            }
          />
          <Label htmlFor="notifications">Enable Notifications</Label>
        </div>
      </div>
    </div>
  );
};

export default PreferencesStep;
