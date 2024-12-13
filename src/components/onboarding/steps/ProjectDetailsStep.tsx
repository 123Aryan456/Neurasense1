import React from "react";
import { ProjectDetails } from "../OnboardingPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectDetailsStepProps {
  projectDetails: ProjectDetails;
  onUpdate: (details: ProjectDetails) => void;
}

const ProjectDetailsStep = ({
  projectDetails,
  onUpdate,
}: ProjectDetailsStepProps) => {
  const handleChange =
    (field: keyof ProjectDetails) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onUpdate({ ...projectDetails, [field]: e.target.value });
    };

  const handleSelectChange = (value: string) => {
    onUpdate({ ...projectDetails, projectType: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Project Details
        </h2>
        <p className="text-muted-foreground">
          Tell us about your Python project
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            placeholder="My Python Project"
            value={projectDetails.projectName}
            onChange={handleChange("projectName")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectType">Project Type</Label>
          <Select
            value={projectDetails.projectType}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python Script</SelectItem>
              <SelectItem value="django">Django Project</SelectItem>
              <SelectItem value="flask">Flask Project</SelectItem>
              <SelectItem value="fastapi">FastAPI Project</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="codeInput">Initial Code (Optional)</Label>
          <Textarea
            id="codeInput"
            placeholder="Paste your Python code here..."
            value={projectDetails.codeInput}
            onChange={handleChange("codeInput")}
            className="h-[200px] font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsStep;
