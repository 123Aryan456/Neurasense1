import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isCompleted ? "bg-primary text-primary-foreground" : ""}
                ${isActive ? "border-2 border-primary text-primary" : ""}
                ${!isActive && !isCompleted ? "border-2 border-muted text-muted-foreground" : ""}
              `}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm">{stepNumber}</span>
              )}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`
                  flex-1 h-0.5 max-w-[50px]
                  ${stepNumber < currentStep ? "bg-primary" : "bg-muted"}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
