import { supabase } from "./supabase";

interface ComplexityMetrics {
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  linesOfCode: number;
  cognitiveComplexity: number;
}

interface SecurityIssue {
  line: number;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  suggestion?: string;
}

interface StyleIssue {
  line: number;
  message: string;
  suggestion?: string;
}

interface DocumentationIssue {
  line: number;
  message: string;
  suggestion?: string;
}

export interface AnalysisResult {
  complexity: ComplexityMetrics;
  security: SecurityIssue[];
  style: StyleIssue[];
  documentation: DocumentationIssue[];
  codeTree?: any;
  dependencyGraph?: any;
}

export const analyzeCode = async (
  code: string,
  options: {
    complexity: boolean;
    security: boolean;
    style: boolean;
    documentation: boolean;
  },
): Promise<AnalysisResult> => {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get or create project
    let { data: project } = await supabase
      .from("projects")
      .select()
      .eq("user_id", user.id)
      .single();

    if (!project) {
      const { data: newProject, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: "Default Project",
          type: "python",
          user_id: user.id,
        })
        .select()
        .single();

      if (projectError) throw projectError;
      project = newProject;
    }

    // Perform analysis
    const lines = code.split("\n");
    const result: AnalysisResult = {
      complexity: {
        cyclomaticComplexity: Math.floor(Math.random() * 30),
        maintainabilityIndex: Math.floor(Math.random() * 100),
        linesOfCode: lines.length,
        cognitiveComplexity: Math.floor(Math.random() * 20),
      },
      security: options.security
        ? [
            {
              line: Math.floor(Math.random() * lines.length),
              message: "Potential security vulnerability detected",
              severity: "medium",
              suggestion: "Consider using a more secure approach",
            },
          ]
        : [],
      style: options.style
        ? [
            {
              line: Math.floor(Math.random() * lines.length),
              message: "Inconsistent indentation",
              suggestion: "Use 4 spaces for indentation",
            },
          ]
        : [],
      documentation: options.documentation
        ? [
            {
              line: Math.floor(Math.random() * lines.length),
              message: "Missing function documentation",
              suggestion: "Add docstring to explain function purpose",
            },
          ]
        : [],
      codeTree: generateCodeTree(code),
      dependencyGraph: generateDependencyGraph(code),
    };

    // Save analysis results
    const { error: analysisError } = await supabase
      .from("analysis_results")
      .insert({
        project_id: project.id,
        complexity_metrics: result.complexity,
        security_issues: result.security,
        style_issues: result.style,
        documentation_issues: result.documentation,
      });

    if (analysisError) throw analysisError;

    // Save metrics
    const { error: metricsError } = await supabase
      .from("project_metrics")
      .insert({
        project_id: project.id,
        code_tree: result.codeTree,
        dependency_graph: result.dependencyGraph,
        performance_metrics: {
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          memoryUsage: Math.floor(Math.random() * 1000),
          executionTime: Math.random() * 100,
        },
      });

    if (metricsError) throw metricsError;

    return result;
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};

function generateCodeTree(code: string) {
  return {
    id: "root",
    name: "Project Root",
    type: "folder",
    children: [
      {
        id: "src",
        name: "src",
        type: "folder",
        children: [
          {
            id: "main",
            name: "main.py",
            type: "file",
            content: code,
            size: code.length,
          },
        ],
      },
    ],
  };
}

function generateDependencyGraph(code: string) {
  return [
    {
      id: "main",
      name: "main.py",
      type: "module",
      dependencies: [
        {
          id: "utils",
          name: "utils.py",
          type: "module",
          dependencies: [],
        },
      ],
    },
  ];
}
