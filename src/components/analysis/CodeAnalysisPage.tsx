import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Upload, History, Loader2, Settings } from "lucide-react";
import { analyzeCode } from "@/lib/codeAnalysis";
import { toast } from "@/components/ui/use-toast";
import { saveAnalysisResults, getCurrentProject } from "@/lib/projectService";
import AnalysisResults from "./AnalysisResults";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/lib/dashboardContext";

interface AnalysisOptions {
  complexity: boolean;
  security: boolean;
  style: boolean;
  documentation: boolean;
}

const CodeAnalysisPage = () => {
  const { setAnalysisResults, analysisResults } = useDashboard();
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [options, setOptions] = useState<AnalysisOptions>({
    complexity: true,
    security: true,
    style: true,
    documentation: true,
  });

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Get current project
      const project = await getCurrentProject();
      if (!project) throw new Error("No project found");

      // Analyze code
      const results = await analyzeCode(code, options);

      // Save results
      await saveAnalysisResults(project.id, results);

      // Update UI
      setAnalysisResults(results);

      toast({
        title: "Analysis Complete",
        description: "Your code has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your code.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleOption = (option: keyof AnalysisOptions) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">
                Code Analysis
              </h1>
              <p className="text-muted-foreground text-lg">
                Analyze your Python code for complexity, security, and style
                issues
              </p>
            </div>
          </div>

          <Tabs defaultValue="code" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px] rounded-xl p-1">
              <TabsTrigger
                value="code"
                className="flex items-center gap-2 rounded-lg"
              >
                <FileCode className="h-4 w-4" />
                Code Input
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="flex items-center gap-2 rounded-lg"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 rounded-lg"
              >
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="space-y-4">
              <Card className="border-2 border-border/50 rounded-2xl overflow-hidden shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="code" className="text-lg font-semibold">
                      Python Code
                    </Label>
                    <Textarea
                      id="code"
                      placeholder="Paste your Python code here..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="h-[300px] font-mono bg-background/50 resize-none rounded-xl border-2 border-border/50 focus:border-primary/50 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      Analysis Options
                    </Label>
                    <div className="grid grid-cols-2 gap-6 p-6 rounded-xl bg-accent/50 backdrop-blur-sm">
                      {Object.entries(options).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center space-x-3 hover:bg-accent/50 p-3 rounded-lg transition-all duration-300 cursor-pointer"
                          onClick={() =>
                            toggleOption(key as keyof AnalysisOptions)
                          }
                        >
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={() =>
                              toggleOption(key as keyof AnalysisOptions)
                            }
                            className="data-[state=checked]:bg-blue-500 rounded-md"
                          />
                          <Label
                            htmlFor={key}
                            className="capitalize cursor-pointer select-none font-medium"
                          >
                            {key.replace(/([A-Z])/g, " $1").trim()} Analysis
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!code.trim() || isAnalyzing}
                    className="w-full h-12 text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>Analyze Code</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <Card className="border-2 border-border/50 rounded-2xl overflow-hidden shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="file" className="text-lg font-semibold">
                      Upload Python File
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="file"
                        type="file"
                        accept=".py"
                        onChange={handleFileUpload}
                        className="flex-1 bg-background/50 rounded-xl border-2 border-border/50 focus:border-primary/50 transition-all duration-300"
                      />
                      <Button
                        onClick={handleAnalyze}
                        disabled={!code.trim() || isAnalyzing}
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 rounded-xl px-6 hover:scale-[1.02] transition-all duration-300"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>Analyze</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="border-2 border-border/50 rounded-2xl overflow-hidden shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis History</CardTitle>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl hover:scale-[1.02] transition-all duration-300"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-center py-8">
                    Analysis history coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <AnimatePresence mode="wait">
            {analysisResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <AnalysisResults results={analysisResults} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default CodeAnalysisPage;
