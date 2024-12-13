import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, XCircle, Info, Crown } from "lucide-react";
import type { AnalysisResult } from "@/lib/codeAnalysis";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  if (!results) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Features Banner */}
      {!results.premium && (
        <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">
                  Unlock Premium Features
                </h3>
              </div>
              <Button
                onClick={() => navigate("/pricing")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
              >
                Upgrade to Premium
              </Button>
            </div>
            <p className="mt-2 text-muted-foreground">
              Get access to AI-powered suggestions, advanced security scanning,
              and performance optimization tips
            </p>
          </CardContent>
        </Card>
      )}

      {/* Premium Analysis Results */}
      {results.premium && (
        <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <CardTitle>Premium Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Code Quality Score */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Code Quality Score</span>
                <span className="text-2xl font-bold text-yellow-500">
                  {results.premium.codeQualityScore}%
                </span>
              </div>
              <Progress
                value={results.premium.codeQualityScore}
                className="h-2 bg-yellow-500/20"
              />
            </div>

            {/* AI Suggestions */}
            {results.premium.aiSuggestions &&
              results.premium.aiSuggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">AI-Powered Suggestions</h4>
                  <div className="space-y-2">
                    {results.premium.aiSuggestions.map((suggestion, index) => (
                      <Alert
                        key={index}
                        className="bg-yellow-500/5 border-yellow-500/20"
                      >
                        <Info className="h-4 w-4 text-yellow-500" />
                        <AlertDescription>{suggestion}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

            {/* Security Vulnerabilities */}
            {results.premium.securityVulnerabilities &&
              results.premium.securityVulnerabilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Advanced Security Analysis</h4>
                  <div className="space-y-2">
                    {results.premium.securityVulnerabilities.map(
                      (vuln, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle className="flex items-center gap-2">
                            {vuln.type}
                            <span
                              className={`px-2 py-0.5 rounded text-xs text-white ${severityColors[vuln.severity]}`}
                            >
                              {vuln.severity}
                            </span>
                          </AlertTitle>
                          <AlertDescription className="mt-2 space-y-2">
                            <p>{vuln.description}</p>
                            <p className="text-sm font-medium">
                              Remediation: {vuln.remediation}
                            </p>
                            {vuln.cve && (
                              <p className="text-sm font-medium">
                                CVE: {vuln.cve}
                              </p>
                            )}
                          </AlertDescription>
                        </Alert>
                      ),
                    )}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}

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
