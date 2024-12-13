import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import UserInfoStep from "./steps/UserInfoStep";
import ProjectDetailsStep from "./steps/ProjectDetailsStep";
import PreferencesStep from "./steps/PreferencesStep";
import StepIndicator from "./StepIndicator";
import { useAuth } from "@/lib/auth";

export type UserInfo = {
  name: string;
  email: string;
  password: string;
};

export type ProjectDetails = {
  projectName: string;
  projectType: string;
  codeInput: string;
};

export type Preferences = {
  analysisTypes: string[];
  visualizationPreferences: string[];
  notifications: boolean;
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    password: "",
  });
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    projectName: "",
    projectType: "python",
    codeInput: "",
  });
  const [preferences, setPreferences] = useState<Preferences>({
    analysisTypes: ["style"],
    visualizationPreferences: ["complexity"],
    notifications: true,
  });

  const handleSignUp = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { user } = await signUp(userInfo.email, userInfo.password, {
        name: userInfo.name,
        preferences,
        project_name: projectDetails.projectName,
        project_type: projectDetails.projectType,
      });

      toast({
        title: "Account created!",
        description:
          "Please check your email to verify your account before signing in.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);

      let errorMessage = "There was a problem creating your account.";

      if (error.message.includes("already registered")) {
        errorMessage =
          "This email is already registered. Please sign in instead.";
      } else if (error.message.includes("rate limit")) {
        errorMessage =
          "Too many signup attempts. Please try again in a few minutes.";
      } else if (error.message.includes("valid email")) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("password")) {
        errorMessage = "Password must be at least 6 characters long.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return userInfo.name && userInfo.email && userInfo.password;
    } else if (currentStep === 2) {
      return projectDetails.projectName;
    } else {
      return (
        preferences.analysisTypes.length > 0 ||
        preferences.visualizationPreferences.length > 0
      );
    }
  };

  const handleNext = async () => {
    if (!canProceed() || isSubmitting) return;

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSignUp();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card">
        <CardContent className="p-6">
          <StepIndicator currentStep={currentStep} totalSteps={3} />

          <div className="mt-8">
            {currentStep === 1 && (
              <UserInfoStep userInfo={userInfo} onUpdate={setUserInfo} />
            )}
            {currentStep === 2 && (
              <ProjectDetailsStep
                projectDetails={projectDetails}
                onUpdate={setProjectDetails}
              />
            )}
            {currentStep === 3 && (
              <PreferencesStep
                preferences={preferences}
                onUpdate={setPreferences}
              />
            )}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
            >
              {currentStep === 3
                ? isSubmitting
                  ? "Creating Account..."
                  : "Complete Setup"
                : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
