import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import type { AnalysisResult } from "@/lib/codeAnalysis";

interface AnalysisResultsProps {
  results: AnalysisResult;
}

const severityColors = {
  low: "bg-yellow-500",
  medium: "bg-orange-500",
  high: "bg-red-500",
  critical: "bg-red-700",
};

const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  if (!results) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Complexity Metrics */}
      {results.complexity && (
        <Card>
          <CardHeader>
            <CardTitle>Complexity Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cyclomatic Complexity</span>
                <span>{results.complexity.cyclomaticComplexity}</span>
              </div>
              <Progress
                value={(results.complexity.cyclomaticComplexity / 30) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Maintainability Index</span>
                <span>{results.complexity.maintainabilityIndex}</span>
              </div>
              <Progress
                value={results.complexity.maintainabilityIndex}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cognitive Complexity</span>
                <span>{results.complexity.cognitiveComplexity}</span>
              </div>
              <Progress
                value={(results.complexity.cognitiveComplexity / 20) * 100}
                className="h-2"
              />
            </div>

            <div className="flex justify-between text-sm">
              <span>Lines of Code</span>
              <span>{results.complexity.linesOfCode}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Issues */}
      {results.security && results.security.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {results.security.map((issue, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center gap-2">
                      Security Issue
                      <span
                        className={`px-2 py-0.5 rounded text-xs text-white ${severityColors[issue.severity]}`}
                      >
                        {issue.severity}
                      </span>
                    </AlertTitle>
                    <AlertDescription>
                      <p>
                        Line {issue.line}: {issue.message}
                      </p>
                      {issue.suggestion && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Suggestion: {issue.suggestion}
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Style Issues */}
      {results.style && results.style.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Style Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {results.style.map((issue, index) => (
                  <Alert key={index}>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Style Issue</AlertTitle>
                    <AlertDescription>
                      <p>
                        Line {issue.line}: {issue.message}
                      </p>
                      {issue.suggestion && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Suggestion: {issue.suggestion}
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Documentation Issues */}
      {results.documentation && results.documentation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documentation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {results.documentation.map((issue, index) => (
                  <Alert key={index}>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Documentation Issue</AlertTitle>
                    <AlertDescription>
                      <p>
                        Line {issue.line}: {issue.message}
                      </p>
                      {issue.suggestion && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Suggestion: {issue.suggestion}
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResults;
