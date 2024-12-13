import { z } from "zod";

export interface AnalysisResult {
  complexity: ComplexityMetrics;
  security: SecurityIssue[];
  style: StyleIssue[];
  documentation: DocumentationIssue[];
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  linesOfCode: number;
  cognitiveComplexity: number;
}

export interface SecurityIssue {
  type: string;
  severity: "low" | "medium" | "high";
  line: number;
  message: string;
  suggestion?: string;
}

export interface StyleIssue {
  type: string;
  line: number;
  message: string;
  suggestion?: string;
}

export interface DocumentationIssue {
  type: string;
  line: number;
  message: string;
  suggestion?: string;
}

const pythonKeywords = [
  "def",
  "class",
  "import",
  "from",
  "return",
  "if",
  "else",
  "elif",
  "for",
  "while",
];

export const analyzeCode = async (
  code: string,
  options: {
    complexity: boolean;
    security: boolean;
    style: boolean;
    documentation: boolean;
  },
): Promise<AnalysisResult> => {
  const lines = code.split("\n");
  const result: AnalysisResult = {
    complexity: {
      cyclomaticComplexity: 0,
      maintainabilityIndex: 0,
      linesOfCode: lines.length,
      cognitiveComplexity: 0,
    },
    security: [],
    style: [],
    documentation: [],
  };

  // Basic complexity analysis
  if (options.complexity) {
    let complexity = 0;
    lines.forEach((line, index) => {
      if (
        line.includes("if") ||
        line.includes("for") ||
        line.includes("while")
      ) {
        complexity++;
      }
    });
    result.complexity.cyclomaticComplexity = complexity;
    result.complexity.maintainabilityIndex = Math.max(0, 100 - complexity * 5);
    result.complexity.cognitiveComplexity = Math.floor(complexity * 1.5);
  }

  // Security analysis
  if (options.security) {
    lines.forEach((line, index) => {
      if (line.includes("eval(")) {
        result.security.push({
          type: "unsafe-eval",
          severity: "high",
          line: index + 1,
          message: "Use of eval() can be dangerous",
          suggestion: "Consider using safer alternatives like JSON.parse()",
        });
      }
      if (line.includes("exec(")) {
        result.security.push({
          type: "unsafe-exec",
          severity: "high",
          line: index + 1,
          message: "Use of exec() can be dangerous",
          suggestion: "Consider using safer alternatives",
        });
      }
    });
  }

  // Style analysis
  if (options.style) {
    lines.forEach((line, index) => {
      if (line.length > 79) {
        result.style.push({
          type: "line-length",
          line: index + 1,
          message: "Line exceeds maximum length of 79 characters",
          suggestion: "Break the line into multiple lines",
        });
      }

      // Check for naming conventions
      const words = line.split(/\s+/);
      words.forEach((word) => {
        if (word.includes("_") && /[A-Z]/.test(word)) {
          result.style.push({
            type: "naming-convention",
            line: index + 1,
            message: "Mixed use of underscores and camelCase",
            suggestion: "Use snake_case for variable names in Python",
          });
        }
      });
    });
  }

  // Documentation analysis
  if (options.documentation) {
    let hasModuleDocstring = false;
    let currentFunction = "";
    let currentClass = "";

    lines.forEach((line, index) => {
      if (index === 0 && !line.includes('"""')) {
        result.documentation.push({
          type: "missing-docstring",
          line: 1,
          message: "Missing module docstring",
          suggestion: "Add a docstring at the beginning of the file",
        });
      }

      if (line.includes("def ")) {
        currentFunction = line;
        if (!lines[index + 1]?.includes('"""')) {
          result.documentation.push({
            type: "missing-docstring",
            line: index + 1,
            message: "Missing function docstring",
            suggestion:
              "Add a docstring explaining the function purpose and parameters",
          });
        }
      }

      if (line.includes("class ")) {
        currentClass = line;
        if (!lines[index + 1]?.includes('"""')) {
          result.documentation.push({
            type: "missing-docstring",
            line: index + 1,
            message: "Missing class docstring",
            suggestion: "Add a docstring explaining the class purpose",
          });
        }
      }
    });
  }

  return result;
};
