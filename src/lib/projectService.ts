import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type AnalysisResult =
  Database["public"]["Tables"]["analysis_results"]["Row"];

export const createProject = async (data: {
  name: string;
  type: string;
  settings?: any;
}) => {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        name: data.name,
        type: data.type,
        settings: data.settings || {},
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return project;
  } catch (error: any) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getCurrentProject = async () => {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return project;
  } catch (error: any) {
    console.error("Error getting current project:", error);
    throw error;
  }
};

export const saveAnalysisResults = async (projectId: string, results: any) => {
  try {
    // Save analysis results
    const { error: analysisError } = await supabase
      .from("analysis_results")
      .insert({
        project_id: projectId,
        complexity_metrics: results.complexity,
        security_issues: results.security,
        style_issues: results.style,
        documentation_issues: results.documentation,
      });

    if (analysisError) throw analysisError;

    // Save project metrics
    const { error: metricsError } = await supabase
      .from("project_metrics")
      .insert({
        project_id: projectId,
        code_tree: results.codeTree,
        dependency_graph: results.dependencyGraph,
        performance_metrics: results.performance,
      });

    if (metricsError) throw metricsError;

    return { success: true };
  } catch (error: any) {
    console.error("Error saving analysis results:", error);
    throw error;
  }
};

export const subscribeToProjectUpdates = (
  projectId: string,
  onAnalysisUpdate: (data: any) => void,
  onMetricsUpdate: (data: any) => void,
) => {
  // Subscribe to analysis_results changes
  const analysisChannel = supabase
    .channel(`analysis_results:${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "analysis_results",
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => onAnalysisUpdate(payload.new),
    )
    .subscribe();

  // Subscribe to project_metrics changes
  const metricsChannel = supabase
    .channel(`project_metrics:${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "project_metrics",
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => onMetricsUpdate(payload.new),
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(analysisChannel);
    supabase.removeChannel(metricsChannel);
  };
};
