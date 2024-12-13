import React from "react";
import { Settings2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WidgetSettingsProps {
  title: string;
  settings: Record<string, boolean>;
  onSettingChange: (key: string, value: boolean) => void;
}

export const WidgetSettings = ({
  title,
  settings,
  onSettingChange,
}: WidgetSettingsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Open {title} settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title} Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure widget display options
            </p>
          </div>
          <div className="grid gap-2">
            {Object.entries(settings).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between space-x-2"
              >
                <Label htmlFor={key} className="flex-1">
                  {key
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .replace(/^[a-z]/, (c) => c.toUpperCase())}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => onSettingChange(key, checked)}
                />
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
