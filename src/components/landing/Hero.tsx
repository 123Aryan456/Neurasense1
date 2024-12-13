import React from "react";
import { Brain } from "lucide-react";
import AuthButtons from "@/components/auth/AuthButtons";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-background overflow-hidden">
      <div className="container mx-auto px-4 text-center z-10 relative">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Brain className="h-6 w-6" />
            <span className="text-lg font-semibold">
              AI-Powered Code Analysis
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 leading-tight">
            Analyze Python Code
            <br />
            <span className="text-foreground">With AI Precision</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Advanced code analysis platform with AI-powered insights, security
            scanning, and performance optimization for Python projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold px-8"
            >
              Start Analyzing
            </Button>
            <AuthButtons />
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img
              src="https://dummyimage.com/1200x600/1a1a1a/ffffff&text=Code+Analysis+Dashboard"
              alt="Code Analysis Dashboard"
              className="rounded-lg shadow-2xl border border-border/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
